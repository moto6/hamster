package com.hasterapi.auth.infra.jwt

import com.hasterapi.auth.api.AuthInfo
import com.hasterapi.auth.app.AuthHistoryOutPort
import com.hasterapi.auth.app.AuthTokenPort
import com.hasterapi.auth.app.payload.IssueTokenCommand
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.Date
import java.util.UUID

@Service
class JwtAuthAdaptor(
    private val authHistoryOutPort: AuthHistoryOutPort,
    @Value("\${custom.jwt.secret}") private val secretKey: String,
    @Value("\${custom.jwt.expiration}") private val expiration: Long
) : AuthTokenPort {
    private val key = Keys.hmacShaKeyFor(secretKey.toByteArray())
    private val jwtParser = Jwts.parser()
        .verifyWith(key)
        .build()

    override suspend fun issue(command: IssueTokenCommand): String {
        val jti = UUID.randomUUID().toString()
        val issuedDate = Date()
        val payload = mapOf(
            "usr" to command.userId,
            "eml" to command.email,
            "dnm" to command.displayName
        )
        val token = Jwts.builder()
            .claims(payload)
            .id(jti)
            .issuedAt(issuedDate)
            .notBefore(issuedDate)
            .expiration(Date(System.currentTimeMillis() + expiration * 1000))
            .signWith(key)
            .compact()

        authHistoryOutPort.saveHistory(jti, command.userId, token)
        return token
    }

    override suspend fun verify(token: String): AuthInfo {
        return try {
            val claims = jwtParser.parseSignedClaims(token).payload
            val jti = claims.id
            AuthInfo(
                userId = claims["usr"] as String,
                email = claims["eml"] as String,
                displayName = claims["dnm"] as String,
                tokenId = jti,
                username = ""
            )
        } catch (e: JwtException) {
            throw RuntimeException("Invalid token signature or expired", e)
        }
    }
}