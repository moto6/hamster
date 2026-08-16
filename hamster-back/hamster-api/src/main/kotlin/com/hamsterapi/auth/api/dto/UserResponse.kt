package com.hamsterapi.auth.api.dto

import com.hamsterapi.auth.app.payload.AuthInfo
import com.hamsterapi.auth.infra.persistance.AccountRecord
import com.hamsterapi.auth.support.toRoleList

/** 프론트로 내려가는 로그인 사용자 표현(민감정보 제외). */
data class UserResponse(
    val ldapId: String,
    val email: String?,
    val displayName: String?,
    val department: String?,
    val roles: List<String>,
) {
    companion object {
        fun from(account: AccountRecord) = UserResponse(
            ldapId = account.ldapId,
            email = account.email,
            displayName = account.displayName,
            department = account.department,
            roles = account.roles.toRoleList(),
        )

        fun from(authInfo: AuthInfo) = UserResponse(
            ldapId = authInfo.ldapId,
            email = authInfo.email,
            displayName = authInfo.displayName,
            department = null,
            roles = authInfo.roles,
        )
    }
}
