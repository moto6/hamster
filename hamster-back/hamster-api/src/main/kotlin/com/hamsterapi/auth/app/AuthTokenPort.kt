package com.hamsterapi.auth.app

import com.hamsterapi.auth.app.payload.AuthInfo
import com.hamsterapi.auth.app.payload.IssueTokenCommand

interface AuthTokenPort {
    suspend fun issue(command: IssueTokenCommand): String
    suspend fun verify(token: String): AuthInfo
    //fun extract(??):??
    //fun authInfoMapping(??):??
}