package com.hasterapi.auth.application.impl

data class IssueTokenCommand(
    val userId: String,
    val email: String,
    val displayName: String
)