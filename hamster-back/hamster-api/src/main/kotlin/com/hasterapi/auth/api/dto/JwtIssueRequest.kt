package com.hasterapi.auth.api.dto

data class JwtIssueRequest(
    val displayName: String,//id
    val email: String,//password
)
