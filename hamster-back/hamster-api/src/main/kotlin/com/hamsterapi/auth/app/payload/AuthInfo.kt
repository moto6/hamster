package com.hamsterapi.auth.app.payload

data class AuthInfo(
    val username: String,
    val userId: String,
    val email: String,
    val displayName: String,
    val tokenId: String
)