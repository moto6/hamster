package com.hamsterapi.auth.iam.service

import com.hamsterapi.auth.iam.exception.InvalidRefreshTokenException
import com.hamsterapi.auth.infra.persistance.RefreshTokenRecord
import com.hamsterapi.auth.infra.persistance.RefreshTokenRepository
import com.hamsterapi.auth.idp.AuthProperties
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.MessageDigest
import java.security.SecureRandom
import java.time.LocalDateTime
import java.util.Base64
import java.util.UUID

/**
 * 리프레시 토큰: 불투명 랜덤값(평문은 쿠키에만), DB엔 SHA-256 해시만.
 * - 회전(rotation): refresh 시 기존 토큰 폐기 + 동일 family 로 새 토큰 발급.
 * - 재사용 탐지: 이미 폐기된 토큰이 다시 들어오면 family 전체 폐기(탈취 의심) 후 401.
 *
 * R2DBC 라 JPA 더티체킹이 없으므로 상태 변경은 명시적으로 save(copy(...)) 한다.
 */
@Service
class RefreshTokenService(
    private val repo: RefreshTokenRepository,
    private val props: AuthProperties,
) {
    private val random = SecureRandom()

    /** 신규 발급(로그인 시). 반환=평문 토큰(쿠키에 실어 클라이언트로). */
    suspend fun issue(accountId: Long, familyId: String = UUID.randomUUID().toString()): String {
        val raw = randomToken()
        repo.save(
            RefreshTokenRecord(
                accountId = accountId,
                tokenHash = sha256Hex(raw),
                familyId = familyId,
                expiresAt = LocalDateTime.now().plusSeconds(props.jwt.refreshTtlSeconds),
            ),
        )
        return raw
    }

    /**
     * 회전. 반환=(accountId, 새 평문 refresh). 검증 실패 시 InvalidRefreshTokenException.
     *
     * 트랜잭션 필수: 조회 → 기존 폐기 → 신규 발급이 원자적이어야 한다. 없으면 같은 refresh 로
     * 동시에 들어온 두 요청이 모두 통과해 토큰이 분기하고, 재사용 탐지가 무력화된다.
     */
    @Transactional
    suspend fun rotate(rawToken: String): Pair<Long, String> {
        val token = repo.findByTokenHash(sha256Hex(rawToken))
            ?: throw InvalidRefreshTokenException("알 수 없는 리프레시 토큰")

        if (token.revoked) {
            // 폐기된 토큰 재사용 → 탈취 의심 → family 전체 폐기
            repo.revokeFamily(token.familyId)
            throw InvalidRefreshTokenException("재사용된 리프레시 토큰입니다. (family 폐기됨)")
        }
        if (token.expiresAt.isBefore(LocalDateTime.now())) {
            repo.save(token.copy(revoked = true))
            throw InvalidRefreshTokenException("만료된 리프레시 토큰입니다.")
        }
        repo.save(token.copy(revoked = true)) // 회전: 기존 토큰 폐기
        val newRaw = issue(token.accountId, token.familyId)
        return token.accountId to newRaw
    }

    /** 로그아웃 등 명시적 폐기. 토큰이 없어도 조용히 통과(idempotent). */
    suspend fun revoke(rawToken: String) {
        repo.findByTokenHash(sha256Hex(rawToken))?.let { repo.save(it.copy(revoked = true)) }
    }

    private fun randomToken(): String {
        val bytes = ByteArray(32).also { random.nextBytes(it) }
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
    }

    private fun sha256Hex(value: String): String =
        MessageDigest.getInstance("SHA-256")
            .digest(value.toByteArray())
            .joinToString("") { "%02x".format(it) }
}
