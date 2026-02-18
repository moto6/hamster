package com.hasterapi.auth.app.payload

data class IssueTokenCommand(
    val userId: String,
    val email: String,
    val displayName: String
)