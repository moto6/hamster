package com.hasterapi.auth.app

import com.hasterapi.auth.api.AuthInfo
import com.hasterapi.auth.app.payload.IssueTokenCommand

interface AuthTokenPort {
    suspend fun issue(command: IssueTokenCommand): String
    suspend fun verify(token: String): AuthInfo
    //fun extract(??):??
    //fun authInfoMapping(??):??
}