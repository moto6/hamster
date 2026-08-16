package com.hamsterapi.auth.idp.infra.impl

import com.hamsterapi.auth.app.payload.ExternalIdentity
import com.hamsterapi.auth.idp.AuthProperties
import com.hamsterapi.auth.idp.domain.IdpProvider
import com.hamsterapi.auth.idp.infra.IdentityProvider
import org.springframework.web.util.UriComponentsBuilder

/**
 * 개발용 IDP. authorize 가 곧장 우리 콜백으로 되돌아와(code=mock-*) 외부 SSO 망 없이 전체 로그인 흐름을 검증한다.
 * `auth.idp=mock` 일 때 사용. 운영에서는 절대 사용 금지.
 */
class MockIdentityProvider(
    private val props: AuthProperties,
) : IdentityProvider {

    override val provider = IdpProvider.MOCK

    // loginHint("user"|"admin") 를 code 에 실어 콜백으로 되돌린다 → exchange 가 다시 읽어 데모 계정을 고른다.
    override fun authorizeUrl(state: String, loginHint: String?): String {
        val code = if (loginHint == "user") CODE_USER else CODE_ADMIN
        return UriComponentsBuilder.fromUriString(props.sso.redirectUri)
            .queryParam("code", code)
            .queryParam("state", state)
            .build().encode().toUriString()
    }

    override suspend fun exchange(code: String): ExternalIdentity = when (code) {
        CODE_USER -> demoIdentity("user.demo")
        else -> demoIdentity("admin.demo")
    }

    private fun demoIdentity(ldapId: String) = ExternalIdentity(
        provider = IdpProvider.MOCK,
        subject = ldapId,
        ldapId = ldapId,
        email = "$ldapId@hamster.io",
        displayName = ldapId,
        department = "개발팀",
    )

    override fun logoutUrl(postLogoutRedirect: String?): String? = postLogoutRedirect

    private companion object {
        const val CODE_ADMIN = "mock-admin"
        const val CODE_USER = "mock-user"
    }
}
