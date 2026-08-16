package com.hamsterapi.auth.iam.service

import com.hamsterapi.auth.iam.exception.InvalidRefreshTokenException
import com.hamsterapi.auth.idp.AuthProperties
import com.hamsterapi.auth.infra.persistance.RefreshTokenRecord
import com.hamsterapi.testsupport.FakeRefreshTokenRepository
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertFalse
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

/**
 * refresh token 은 유일한 장기 자격증명이다. 회전과 재사용 탐지가 제대로 동작하지 않으면
 * 한 번 탈취당한 세션을 영원히 되찾을 수 없다. 정상 경로보다 탈취 시나리오를 더 촘촘히 본다.
 */
class RefreshTokenServiceTest {

    private val repo = FakeRefreshTokenRepository()
    private val props = AuthProperties(jwt = AuthProperties.Jwt(refreshTtlSeconds = 3600))
    private val sut = RefreshTokenService(repo, props)

    private val accountId = 42L

    private fun stored(raw: String): RefreshTokenRecord? = repo.rows().firstOrNull { it.tokenHash == sha256Hex(raw) }

    private fun sha256Hex(value: String): String =
        java.security.MessageDigest.getInstance("SHA-256")
            .digest(value.toByteArray())
            .joinToString("") { "%02x".format(it) }

    @Test
    @DisplayName("issue(): 평문은 반환만 하고 DB 에는 SHA-256 해시만 저장한다")
    fun issue_StoresHashNotPlaintext() = runTest {
        // given & when
        val raw = sut.issue(accountId)

        // then
        val record = assertNotNull(stored(raw), "발급한 토큰이 저장되지 않았다")
        assertEquals(sha256Hex(raw), record.tokenHash)
        assertTrue(repo.rows().none { it.tokenHash == raw }, "평문이 그대로 저장되면 DB 유출 시 즉시 세션 탈취")
        assertTrue(record.tokenHash.matches(Regex("[0-9a-f]{64}")), "SHA-256 hex 형식이 아니다")
    }

    @Test
    @DisplayName("issue(): 호출마다 예측 불가능한 서로 다른 토큰을 낸다")
    fun issue_ProducesUniqueTokens() = runTest {
        // given & when
        val tokens = List(100) { sut.issue(accountId) }

        // then
        assertEquals(100, tokens.distinct().size, "토큰이 중복 생성됐다")
        assertTrue(tokens.all { it.length >= 40 }, "엔트로피가 부족한 토큰 길이")
    }

    @Test
    @DisplayName("issue(): 설정한 TTL 만큼 만료시각이 잡히고 폐기 상태가 아니다")
    fun issue_SetsExpiryFromProperties() = runTest {
        // given
        val before = LocalDateTime.now()

        // when
        val raw = sut.issue(accountId)

        // then
        val record = assertNotNull(stored(raw))
        assertFalse(record.revoked)
        assertEquals(accountId, record.accountId)
        assertTrue(record.expiresAt.isAfter(before.plusSeconds(3500)))
        assertTrue(record.expiresAt.isBefore(before.plusSeconds(3700)))
    }

    @Test
    @DisplayName("rotate(): 기존 토큰을 폐기하고 같은 family 로 새 토큰을 발급한다")
    fun rotate_RevokesOldAndIssuesNew() = runTest {
        // given
        val original = sut.issue(accountId)
        val originalRecord = assertNotNull(stored(original))

        // when
        val (returnedAccountId, rotated) = sut.rotate(original)

        // then
        assertEquals(accountId, returnedAccountId)
        assertTrue(rotated != original, "회전인데 같은 토큰이 나왔다")
        assertTrue(assertNotNull(stored(original)).revoked, "기존 토큰이 폐기되지 않았다")
        val newRecord = assertNotNull(stored(rotated))
        assertFalse(newRecord.revoked)
        assertEquals(originalRecord.familyId, newRecord.familyId, "회전 체인은 같은 family 를 유지해야 한다")
    }

    @Test
    @DisplayName("rotate(): 폐기된 토큰은 곧바로 다시 회전되지 않는다")
    fun rotate_RejectsAlreadyRotatedToken() = runTest {
        // given
        val original = sut.issue(accountId)
        sut.rotate(original)

        // when & then
        assertFailsWith<InvalidRefreshTokenException> { sut.rotate(original) }
    }

    @Test
    @DisplayName("rotate(): 탈취 토큰 재사용이 감지되면 family 전체가 폐기된다")
    fun rotate_RevokesWholeFamilyOnReuse() = runTest {
        // given — 공격자가 stolen 을 훔친 뒤 정상 사용자가 먼저 회전한 상황
        val stolen = sut.issue(accountId)
        val (_, victimsCurrent) = sut.rotate(stolen)
        assertFalse(assertNotNull(stored(victimsCurrent)).revoked, "테스트 전제: 정상 사용자 토큰은 살아 있다")

        // when — 공격자가 이미 회전된 옛 토큰을 사용
        assertFailsWith<InvalidRefreshTokenException> { sut.rotate(stolen) }

        // then — 공격자 차단만으로는 부족하다. 정상 사용자의 최신 토큰까지 무효화되어야 재로그인이 강제된다.
        assertTrue(assertNotNull(stored(victimsCurrent)).revoked, "family 전체 폐기가 동작하지 않았다")
        assertTrue(repo.rows().all { it.revoked }, "family 에 살아남은 토큰이 있다")
        assertFailsWith<InvalidRefreshTokenException> { sut.rotate(victimsCurrent) }
    }

    @Test
    @DisplayName("rotate(): 등록되지 않은 토큰은 거부되고 아무것도 저장하지 않는다")
    fun rotate_RejectsUnknownToken() = runTest {
        // given
        val bogus = "완전히-지어낸-토큰"

        // when & then
        assertFailsWith<InvalidRefreshTokenException> { sut.rotate(bogus) }
        assertEquals(0, repo.rows().size, "미지의 토큰으로 레코드가 생성되면 안 된다")
    }

    @Test
    @DisplayName("rotate(): 만료된 토큰은 거부되고 즉시 폐기된다")
    fun rotate_RejectsAndRevokesExpiredToken() = runTest {
        // given — 이미 만료된 토큰을 직접 심는다
        val expiredService = RefreshTokenService(repo, AuthProperties(jwt = AuthProperties.Jwt(refreshTtlSeconds = -1)))
        val expired = expiredService.issue(accountId)

        // when
        assertFailsWith<InvalidRefreshTokenException> { sut.rotate(expired) }

        // then
        assertTrue(assertNotNull(stored(expired)).revoked, "만료 토큰이 폐기되지 않고 남았다")
        assertEquals(1, repo.rows().size, "실패한 회전이 새 토큰을 발급하면 안 된다")
    }

    @Test
    @DisplayName("rotate(): 만료 판정은 family 를 전부 죽이지 않는다 (재사용 탐지와 구분)")
    fun rotate_ExpiryDoesNotRevokeFamily() = runTest {
        // given — 같은 family 에 살아 있는 토큰이 하나 더 있는 상태
        val expiredService = RefreshTokenService(repo, AuthProperties(jwt = AuthProperties.Jwt(refreshTtlSeconds = -1)))
        val expired = expiredService.issue(accountId, familyId = "family-1")
        val alive = sut.issue(accountId, familyId = "family-1")

        // when
        assertFailsWith<InvalidRefreshTokenException> { sut.rotate(expired) }

        // then — 단순 만료는 탈취 신호가 아니므로 다른 기기 세션까지 끊지 않는다
        assertTrue(assertNotNull(stored(expired)).revoked)
        assertFalse(assertNotNull(stored(alive)).revoked, "만료 하나로 family 전체가 끊겼다")
    }

    @Test
    @DisplayName("revoke(): 로그아웃한 토큰은 이후 회전에 쓸 수 없다")
    fun revoke_MakesTokenUnusable() = runTest {
        // given
        val raw = sut.issue(accountId)

        // when
        sut.revoke(raw)

        // then
        assertTrue(assertNotNull(stored(raw)).revoked)
        assertFailsWith<InvalidRefreshTokenException> { sut.rotate(raw) }
    }

    @Test
    @DisplayName("revoke(): 알 수 없는 토큰이어도 조용히 통과한다 (멱등)")
    fun revoke_IsIdempotentForUnknownToken() = runTest {
        // given
        val raw = sut.issue(accountId)

        // when & then — 로그아웃 API 가 토큰 존재 여부를 흘리지 않도록 예외를 던지지 않는다
        sut.revoke("존재하지-않는-토큰")
        sut.revoke(raw)
        sut.revoke(raw)
        assertEquals(1, repo.rows().count { it.revoked })
    }

    @Test
    @DisplayName("서로 다른 로그인은 서로 다른 family 를 가져 한쪽 폐기가 다른 쪽에 번지지 않는다")
    fun issue_SeparatesFamiliesPerLogin() = runTest {
        // given — 노트북/휴대폰에서 각각 로그인
        val laptop = sut.issue(accountId)
        val phone = sut.issue(accountId)

        // when — 노트북 세션에서 재사용 탐지가 발동
        sut.rotate(laptop)
        assertFailsWith<InvalidRefreshTokenException> { sut.rotate(laptop) }

        // then — 휴대폰 세션은 살아 있어야 한다
        assertFalse(assertNotNull(stored(phone)).revoked, "다른 기기 세션까지 끊겼다")
    }
}
