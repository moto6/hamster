package com.hamsterapi.auth.iam.service

import com.hamsterapi.auth.app.AuthHistoryOutPort
import com.hamsterapi.auth.app.payload.AuthInfo
import com.hamsterapi.auth.iam.domain.AuthType
import com.hamsterapi.auth.iam.exception.InvalidAccessTokenException
import com.hamsterapi.auth.infra.persistance.AccountRecord
import com.hamsterapi.auth.idp.AuthProperties
import com.hamsterapi.auth.support.toRoleList
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Service
import java.util.Date
import java.util.UUID
import javax.crypto.SecretKey

/**
 * 자체 access token(JWT, HS256) 발급/검증. 무상태(stateless) — DB 조회 없이 서명만으로 검증.
 * 취소가 필요한 장기 자격증명은 refresh token(회전/DB) 쪽에서 담당한다.
 * 발급 시 jti 를 auth_history 에 남겨 감사 추적을 유지한다(기존 hamster 기능 계승).
 */
@Service
class JwtService(
    private val props: AuthProperties,
    private val authHistoryOutPort: AuthHistoryOutPort,
) {
    private val key: SecretKey = Keys.hmacShaKeyFor(props.jwt.secret.toByteArray())
    private val parser = Jwts.parser()
        .verifyWith(key)
        .requireIssuer(props.jwt.issuer)
        .build()

    suspend fun issueAccessToken(account: AccountRecord): String {
        val now = Date()
        val jti = UUID.randomUUID().toString()
        val token = Jwts.builder()
            .issuer(props.jwt.issuer)
            .subject(account.ldapId)
            .id(jti)
            .claim("email", account.email)
            .claim("name", account.displayName)
            .claim("roles", account.roles.toRoleList())
            .claim("typ", "access")
            .issuedAt(now)
            .notBefore(now)
            .expiration(Date(now.time + props.jwt.accessTtlSeconds * 1000))
            .signWith(key)
            .compact()
        authHistoryOutPort.saveHistory(jti, props.jwt.issuer, token)
        return token
    }

    /** 서명·만료 검증 후 AuthInfo 로 변환. 실패 시 InvalidAccessTokenException. */
    fun parse(token: String): AuthInfo {
        try {
            val claims = parser.parseSignedClaims(token).payload

            @Suppress("UNCHECKED_CAST")
            val roles = (claims["roles"] as? List<String>) ?: emptyList()
            val ldapId = claims.subject
            return AuthInfo(
                ldapId = ldapId,
                userId = ldapId,
                email = claims["email"] as? String ?: "$ldapId@hamster.io",
                displayName = claims["name"] as? String ?: ldapId,
                roles = roles,
                tokenId = claims.id,
                authType = AuthType.ACCESS_TOKEN,
            )
        } catch (e: JwtException) {
            throw InvalidAccessTokenException("유효하지 않은 access token: ${e.message}")
        } catch (e: IllegalArgumentException) {
            throw InvalidAccessTokenException("유효하지 않은 access token")
        }
    }
}
