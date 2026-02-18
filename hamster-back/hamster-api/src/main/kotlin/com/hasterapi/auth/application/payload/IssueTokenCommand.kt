package com.hasterapi.auth.application.payload

data class IssueTokenCommand(
    val userId: String,
    val email: String,
    val displayName: String
)