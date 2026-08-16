package com.hamsterapi.auth.iam.service

import com.hamsterapi.auth.iam.domain.AuthType
import com.hamsterapi.auth.iam.exception.InvalidAccessTokenException
import com.hamsterapi.auth.idp.AuthProperties
import com.hamsterapi.auth.infra.persistance.AccountRecord
import com.hamsterapi.testsupport.FakeAuthHistoryOutPort
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import java.util.Base64
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

/**
 * access token 은 무상태 검증이라 서명·발급자·만료가 유일한 방어선이다.
 * 위조/만료/발급자 위장 토큰이 하나라도 통과하면 인증 전체가 무의미해지므로 공격자 관점에서 검증한다.
 */
class JwtServiceTest {

    private val secret = "test-secret-key-that-is-long-enough-for-hs256!!"
    private val history = FakeAuthHistoryOutPort()

    private fun properties(
        issuer: String = "hamster",
        secretKey: String = secret,
        ttlSeconds: Long = 1800,
    ) = AuthProperties(
        jwt = AuthProperties.Jwt(issuer = issuer, secret = secretKey, accessTtlSeconds = ttlSeconds),
    )

    private fun service(
        issuer: String = "hamster",
        secretKey: String = secret,
        ttlSeconds: Long = 1800,
    ) = JwtService(properties(issuer, secretKey, ttlSeconds), history)

    private fun account(
        ldapId: String = "hong.gd",
        email: String? = "hong.gd@hamster.io",
        displayName: String? = "홍길동",
        roles: String = "USER,MANAGER",
    ) = AccountRecord(id = 1L, ldapId = ldapId, email = email, displayName = displayName, roles = roles)

    @Test
    @DisplayName("발급한 토큰을 파싱하면 계정 정보와 역할이 그대로 복원된다")
    fun issueAndParse_RoundTrips() = runTest {
        // given
        val sut = service()

        // when
        val token = sut.issueAccessToken(account())
        val authInfo = sut.parse(token)

        // then
        assertEquals("hong.gd", authInfo.ldapId)
        assertEquals("hong.gd", authInfo.userId)
        assertEquals("hong.gd@hamster.io", authInfo.email)
        assertEquals("홍길동", authInfo.displayName)
        assertEquals(listOf("USER", "MANAGER"), authInfo.roles)
        assertEquals(AuthType.ACCESS_TOKEN, authInfo.authType)
        assertNotNull(authInfo.tokenId, "jti 가 없으면 감사 추적이 불가능하다")
    }

    @Test
    @DisplayName("발급 시 jti 가 감사 이력에 기록되고 매번 달라진다")
    fun issue_RecordsUniqueJti() = runTest {
        // given
        val sut = service()
        val before = history.issuedJtis.size

        // when
        val first = sut.parse(sut.issueAccessToken(account()))
        val second = sut.parse(sut.issueAccessToken(account()))

        // then
        assertEquals(before + 2, history.issuedJtis.size)
        assertTrue(first.tokenId != second.tokenId, "jti 가 재사용되면 감사 추적이 무너진다")
    }

    @Test
    @DisplayName("다른 시크릿으로 서명된 토큰은 거부된다")
    fun parse_RejectsForeignSignature() = runTest {
        // given — 공격자가 자체 키로 동일 구조의 토큰을 만든 상황
        val attacker = service(secretKey = "attacker-secret-key-long-enough-for-hs256!!!!!")
        val forged = attacker.issueAccessToken(account(roles = "SUPER_ADMIN"))

        // when & then
        assertFailsWith<InvalidAccessTokenException> { service().parse(forged) }
    }

    @Test
    @DisplayName("발급자(issuer)가 다른 토큰은 거부된다")
    fun parse_RejectsForeignIssuer() = runTest {
        // given — 같은 시크릿을 쓰는 다른 서비스가 발급한 토큰이 우리 API 에 재사용되면 안 된다
        val otherService = service(issuer = "other-service")
        val token = otherService.issueAccessToken(account())

        // when & then
        assertFailsWith<InvalidAccessTokenException> { service().parse(token) }
    }

    @Test
    @DisplayName("만료된 토큰은 거부된다")
    fun parse_RejectsExpiredToken() = runTest {
        // given — TTL 을 음수로 줘서 이미 만료된 토큰을 만든다
        val sut = service(ttlSeconds = -60)
        val expired = sut.issueAccessToken(account())

        // when & then
        assertFailsWith<InvalidAccessTokenException> { service().parse(expired) }
    }

    @Test
    @DisplayName("페이로드를 권한 상승 목적으로 변조하면 서명 검증에서 걸린다")
    fun parse_RejectsTamperedPayload() = runTest {
        // given
        val sut = service()
        val token = sut.issueAccessToken(account(roles = "USER"))
        val (header, payload, signature) = token.split(".")
        val decoder = Base64.getUrlDecoder()
        val encoder = Base64.getUrlEncoder().withoutPadding()
        val escalated = String(decoder.decode(payload)).replace("\"USER\"", "\"SUPER_ADMIN\"")
        val tampered = "$header.${encoder.encodeToString(escalated.toByteArray())}.$signature"

        // when & then
        assertTrue(tampered != token, "테스트 전제: 페이로드가 실제로 바뀌어야 한다")
        assertFailsWith<InvalidAccessTokenException> { sut.parse(tampered) }
    }

    @Test
    @DisplayName("alg=none 무서명 토큰은 거부된다")
    fun parse_RejectsUnsignedToken() = runTest {
        // given — JWT 구현체의 고전적 취약점. 서명 없는 토큰이 통과하면 누구나 관리자가 된다.
        val encoder = Base64.getUrlEncoder().withoutPadding()
        val header = encoder.encodeToString("""{"alg":"none"}""".toByteArray())
        val payload = encoder.encodeToString(
            """{"iss":"hamster","sub":"hong.gd","roles":["SUPER_ADMIN"]}""".toByteArray(),
        )

        // when & then
        assertFailsWith<InvalidAccessTokenException> { service().parse("$header.$payload.") }
    }

    @Test
    @DisplayName("형식이 아예 아닌 문자열도 500 이 아니라 401 계열 예외가 된다")
    fun parse_RejectsGarbageInput() {
        // given
        val sut = service()
        val garbage = listOf("", "   ", "not-a-jwt", "a.b", "a.b.c.d", "Bearer abc.def.ghi")

        // when & then — 여기서 다른 예외가 새면 GlobalExceptionHandler 가 500 으로 처리한다
        garbage.forEach { raw ->
            assertFailsWith<InvalidAccessTokenException>("입력 [$raw]") { sut.parse(raw) }
        }
    }

    @Test
    @DisplayName("역할이 없는 계정의 토큰은 빈 역할 목록으로 파싱된다")
    fun parse_HandlesEmptyRoles() = runTest {
        // given
        val sut = service()

        // when
        val authInfo = sut.parse(sut.issueAccessToken(account(roles = "")))

        // then
        assertEquals(emptyList(), authInfo.roles)
        assertTrue(authInfo.grantedRoles.isEmpty())
    }

    @Test
    @DisplayName("email/displayName 이 없는 계정은 ldapId 기반 기본값으로 채워진다")
    fun parse_FallsBackWhenClaimsMissing() = runTest {
        // given
        val sut = service()

        // when
        val authInfo = sut.parse(sut.issueAccessToken(account(email = null, displayName = null)))

        // then
        assertEquals("hong.gd@hamster.io", authInfo.email)
        assertEquals("hong.gd", authInfo.displayName)
    }

    @Test
    @DisplayName("차단(blockToken)된 jti 의 토큰도 parse 는 통과한다 — 즉시 무효화 수단이 없다")
    fun parse_DoesNotConsultBlocklist() = runTest {
        // given
        val sut = service()
        val token = sut.issueAccessToken(account())
        val jti = sut.parse(token).tokenId!!
        history.blockToken(jti, java.time.LocalDateTime.now().plusHours(1))

        // when
        val stillValid = sut.parse(token)

        // then — parse() 는 서명만 보고 isBlocked 를 조회하지 않는다.
        //        따라서 탈취된 access token 은 TTL(기본 30분)이 끝날 때까지 유효하다.
        assertTrue(history.isBlocked(jti), "테스트 전제: 차단 목록에 등록되어 있다")
        assertEquals(jti, stillValid.tokenId)
    }
}
