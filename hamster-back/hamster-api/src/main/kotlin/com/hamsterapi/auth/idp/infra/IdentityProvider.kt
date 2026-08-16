package com.hamsterapi.auth.idp.infra

import com.hamsterapi.auth.app.payload.ExternalIdentity
import com.hamsterapi.auth.idp.domain.IdpProvider

/**
 * IDP 교체 가능 경계(포트). IDP 변경은 어댑터 추가 + 설정 전환으로 끝난다.
 */
interface IdentityProvider {
    val provider: IdpProvider

    /**
     * 로그인 시작: 사용자를 보낼 IDP authorize URL (state 포함).
     * loginHint 는 개발용 Mock IDP 에서 어떤 데모 계정으로 로그인할지 선택하는 데 쓰인다(운영 IDP 는 무시).
     */
    fun authorizeUrl(state: String, loginHint: String? = null): String

    /** 콜백의 authorization code 를 신원으로 교환. (네트워크 IO 가능 → suspend) */
    suspend fun exchange(code: String): ExternalIdentity

    /** (선택) IDP 로그아웃 URL. 없으면 null. */
    fun logoutUrl(postLogoutRedirect: String?): String?
}
