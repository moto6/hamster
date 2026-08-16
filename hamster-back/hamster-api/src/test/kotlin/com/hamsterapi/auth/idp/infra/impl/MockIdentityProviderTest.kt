package com.hamsterapi.auth.idp.infra.impl

import com.hamsterapi.auth.idp.AuthProperties
import com.hamsterapi.auth.idp.domain.IdpProvider
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import kotlin.test.assertContains
import kotlin.test.assertEquals
import kotlin.test.assertNull

/**
 * 개발 전용 IDP. 운영에 새어 들어가면 인증이 사실상 무력화되므로,
 * "이 어댑터가 얼마나 관대한가"를 명시적으로 기록해 둔다.
 */
class MockIdentityProviderTest {

    private val props = AuthProperties(
        sso = AuthProperties.Sso(redirectUri = "http://localhost:5173/api/v0/auth/callback"),
    )
    private val sut = MockIdentityProvider(props)

    @Test
    @DisplayName("authorizeUrl(): state 를 그대로 실어 콜백 URL 로 되돌린다")
    fun authorizeUrl_EchoesStateToCallback() {
        // given
        val state = "csrf-state-123"

        // when
        val url = sut.authorizeUrl(state, loginHint = "user")

        // then
        assertContains(url, "http://localhost:5173/api/v0/auth/callback")
        assertContains(url, "state=$state")
        assertContains(url, "code=mock-user")
    }

    @Test
    @DisplayName("authorizeUrl(): loginHint 가 'user' 가 아니면 전부 관리자 코드가 된다")
    fun authorizeUrl_DefaultsToAdminCode() {
        // given — 오타("uesr")나 미지정이 곧바로 관리자 로그인으로 이어진다
        val hints = listOf(null, "admin", "uesr", "", "USER")

        // when & then
        hints.forEach { hint ->
            assertContains(sut.authorizeUrl("s", hint), "code=mock-admin", message = "hint=[$hint]")
        }
    }

    @Test
    @DisplayName("exchange(): mock-user 코드는 일반 사용자 신원을 준다")
    fun exchange_ReturnsDemoUser() = runTest {
        // given & when
        val identity = sut.exchange("mock-user")

        // then
        assertEquals(IdpProvider.MOCK, identity.provider)
        assertEquals("user.demo", identity.ldapId)
        assertEquals("user.demo", identity.subject)
        assertEquals("user.demo@hamster.io", identity.email)
    }

    @Test
    @DisplayName("exchange(): 알 수 없는 코드는 거부되지 않고 부트스트랩 관리자 계정을 내준다")
    fun exchange_FallsBackToAdminForAnyCode() = runTest {
        // given — admin.demo 는 bootstrapSuperAdmins 기본값이라 곧 SUPER_ADMIN 이다
        val arbitraryCodes = listOf("", "아무거나", "mock-admin", "'; DROP TABLE account; --")

        // when & then — 검증 없이 전권 계정으로 떨어진다. auth.idp=mock 이 운영에 새면 인증이 무의미해진다.
        arbitraryCodes.forEach { code ->
            assertEquals("admin.demo", sut.exchange(code).ldapId, "code=[$code]")
        }
    }

    @Test
    @DisplayName("logoutUrl(): 전달받은 리다이렉트를 그대로 돌려주고, 없으면 null 이다")
    fun logoutUrl_PassesThrough() {
        // given & when & then
        assertEquals("http://localhost:5173/", sut.logoutUrl("http://localhost:5173/"))
        assertNull(sut.logoutUrl(null))
    }

    @Test
    @DisplayName("provider 는 항상 MOCK 이다 (연결 레코드가 운영 IDP 와 섞이지 않는다)")
    fun provider_IsAlwaysMock() = runTest {
        // given & when & then
        assertEquals(IdpProvider.MOCK, sut.provider)
        assertEquals(IdpProvider.MOCK, sut.exchange("mock-user").provider)
    }
}
