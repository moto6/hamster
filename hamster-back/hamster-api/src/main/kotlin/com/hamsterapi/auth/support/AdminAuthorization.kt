package com.hamsterapi.auth.support

import com.hamsterapi.auth.app.payload.AuthInfo
import com.hamsterapi.auth.iam.domain.AdminRoles
import org.springframework.stereotype.Component

/**
 * RBAC 인가. AuthInfo(WebFilter 가 검증·바인딩) 의 역할로 판정한다.
 * SUPER_ADMIN 은 모든 검사를 통과(전권). 그 외에는 allowedRoles 중 하나를 보유해야 한다.
 *
 * 프론트의 메뉴 게이팅은 UX 일 뿐이고, 실제 보안 경계는 백엔드의 이 검사(403)다.
 */
@Component
class AdminAuthorization {

    /** SUPER_ADMIN 또는 allowedRoles 중 하나 필요. 미보유 시 403. */
    fun verify(authInfo: AuthInfo, vararg allowedRoles: AdminRoles) {
        if (authInfo.hasRole(AdminRoles.SUPER_ADMIN)) return
        if (allowedRoles.none { authInfo.hasRole(it) }) {
            throw AdminAuthorizeOnlyException(
                "접근 권한이 없습니다. 필요 권한: ${(listOf(AdminRoles.SUPER_ADMIN) + allowedRoles).joinToString(", ")}",
            )
        }
    }

    /** SUPER_ADMIN 전용. */
    fun verifySuperAdmin(authInfo: AuthInfo) = verify(authInfo)
}
