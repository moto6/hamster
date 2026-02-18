package com.hasterapi.auth.api.dto

import com.hasterapi.auth.application.payload.IssueTokenCommand

data class JwtIssueRequest(
    val displayName: String,//id
    val email: String,//password
) {
    fun toCommand(): IssueTokenCommand {
        return IssueTokenCommand(
            userId = this.displayName,
            email = this.email,
            displayName = this.email,
        )
    }
}
