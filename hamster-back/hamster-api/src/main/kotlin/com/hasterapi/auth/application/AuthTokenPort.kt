package com.hasterapi.auth.application

import com.hasterapi.auth.api.AuthInfo
import com.hasterapi.auth.application.payload.IssueTokenCommand

interface AuthTokenPort {
    suspend fun issue(command: IssueTokenCommand): String
    suspend fun verify(token: String): AuthInfo
    //fun extract(??):??
    //fun authInfoMapping(??):??
}