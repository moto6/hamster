package com.hamsterapi.auth.iam.domain

/**
 * RBAC 역할. SUPER_ADMIN 은 전권, MANAGER 는 스코프된 관리자 권한(예: 도서/회의실 운영),
 * USER 는 일반 사용자. 신규 스코프 권한은 여기에 값을 추가하고
 * 컨트롤러/서비스에서 adminAuthorization.verify(authInfo, <역할>) 로 검사한다.
 */
enum class AdminRoles {
    USER,
    SUPER_ADMIN,
    MANAGER, ;

    companion object {
        private val roleMap: Map<String, AdminRoles> = entries.associateBy { it.name.uppercase() }

        fun fromString(roleName: String): AdminRoles? = roleMap[roleName.uppercase()]
    }
}
