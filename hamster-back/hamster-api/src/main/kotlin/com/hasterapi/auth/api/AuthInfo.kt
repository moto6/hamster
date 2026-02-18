package com.hasterapi.auth.api

data class AuthInfo(
    val username: String,
    val userId: String,
    val email: String,
    val displayName: String,
    val tokenId: String
) {

}