package com.hamsterapi.auth.app.payload

import com.hamsterapi.auth.iam.domain.AdminRoles
import com.hamsterapi.auth.iam.domain.AuthType

/**
 * 요청 처리 시점의 인증된 주체 (런타임 VO, DB 미저장).
 * 업무 코드/컨트롤러는 IDP·자격증명 종류를 모르고 오직 이것만 본다.
 *
 * - `ldapId` 가 기준 식별자이며, 하위호환을 위해 `userId` 는 동일 값(기존 컨트롤러가 사용)으로 둔다.
 * - `roles` 로 RBAC 판정(AdminAuthorization)을 수행한다.
 */
data class AuthInfo(
    val ldapId: String,
    val userId: String = ldapId,
    val email: String,
    val displayName: String,
    val roles: List<String> = emptyList(),
    val tokenId: String? = null,
    val authType: AuthType = AuthType.ACCESS_TOKEN,
    val username: String = ldapId,
) {
    val grantedRoles: Set<AdminRoles> = roles.mapNotNull { AdminRoles.fromString(it) }.toSet()

    fun hasRole(role: AdminRoles): Boolean = grantedRoles.contains(role)

    fun hasAnyRole(vararg rolesToCheck: AdminRoles): Boolean =
        rolesToCheck.any { grantedRoles.contains(it) }
}
