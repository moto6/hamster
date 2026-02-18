package com.hasterapi.auth.application

import com.hasterapi.auth.application.impl.IssueTokenCommand

interface IssueTokenUseCase {
    suspend fun issue(command: IssueTokenCommand): String
}