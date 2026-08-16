package com.hamsterapi.auth.api.dto

/** /refresh 응답. access token 은 본문, refresh 는 HttpOnly 쿠키로만 오간다. */
data class TokenResponse(
    val accessToken: String,
    val tokenType: String = "Bearer",
    val expiresIn: Long,
    val user: UserResponse,
)
