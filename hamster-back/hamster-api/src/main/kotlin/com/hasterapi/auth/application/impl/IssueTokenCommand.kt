package com.hasterapi.auth.application.impl

data class IssueTokenCommand(
    val ldap: String,
    val email: String,
    val displayName: String
)