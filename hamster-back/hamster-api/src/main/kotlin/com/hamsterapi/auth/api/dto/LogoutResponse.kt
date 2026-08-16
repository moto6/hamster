package com.hamsterapi.auth.api.dto

/** 로그아웃 응답. (선택) IDP 로그아웃 URL 을 함께 내려 프론트가 추가 리다이렉트할 수 있게 한다. */
data class LogoutResponse(
    val logoutUrl: String?,
)
