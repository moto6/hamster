package com.hamsterapi.auth.api.dto

import com.hamsterapi.auth.app.payload.IssueTokenCommand

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
