package com.hasterapi.auth.api.dto

data class JwtIssueResponse(
    val tokenType: String = "Bearer",
    val separator: String = " ",
    val accessToken: String,
    val expiresIn: Long? = null,
)
