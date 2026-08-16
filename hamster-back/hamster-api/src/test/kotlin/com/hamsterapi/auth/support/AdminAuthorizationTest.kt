package com.hamsterapi.auth.support

import com.hamsterapi.auth.app.payload.AuthInfo
import com.hamsterapi.auth.iam.domain.AdminRoles
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import kotlin.test.assertContains
import kotlin.test.assertFailsWith

/**
 * 실제 보안 경계. 프론트 게이팅은 UX 일 뿐이므로 여기가 뚫리면 막을 곳이 없다.
 * "통과해야 할 때 통과한다"보다 "막아야 할 때 막는다"를 더 촘촘히 검증한다.
 */
class AdminAuthorizationTest {

    private val sut = AdminAuthorization()

    private fun authInfo(vararg roles: String) = AuthInfo(
        ldapId = "hong.gd",
        email = "hong.gd@hamster.io",
        displayName = "홍길동",
        roles = roles.toList(),
    )

    @Test
    @DisplayName("SUPER_ADMIN 은 요구 역할과 무관하게 통과한다 (전권)")
    fun verify_SuperAdminBypassesEveryCheck() {
        // given
        val superAdmin = authInfo("SUPER_ADMIN")

        // when & then — 예외가 없으면 통과
        sut.verify(superAdmin, AdminRoles.MANAGER)
        sut.verify(superAdmin)
        sut.verifySuperAdmin(superAdmin)
    }

    @Test
    @DisplayName("요구 역할을 보유하면 통과한다")
    fun verify_AllowsRequiredRole() {
        // given
        val manager = authInfo("USER", "MANAGER")

        // when & then
        sut.verify(manager, AdminRoles.MANAGER)
        sut.verify(manager, AdminRoles.MANAGER, AdminRoles.USER)
    }

    @Test
    @DisplayName("요구 역할을 보유하지 않으면 403 예외로 차단된다")
    fun verify_DeniesMissingRole() {
        // given
        val user = authInfo("USER")

        // when
        val error = assertFailsWith<AdminAuthorizeOnlyException> {
            sut.verify(user, AdminRoles.MANAGER)
        }

        // then — 응답 문구에 필요 권한만 담기고 내부 식별자/스택은 담기지 않는다
        assertContains(error.message!!, "접근 권한이 없습니다")
        assertContains(error.message!!, "MANAGER")
    }

    @Test
    @DisplayName("역할이 하나도 없는 주체는 모든 검사에서 차단된다")
    fun verify_DeniesRolelessPrincipal() {
        // given
        val anonymousLike = authInfo()

        // when & then
        assertFailsWith<AdminAuthorizeOnlyException> { sut.verify(anonymousLike, AdminRoles.MANAGER) }
        assertFailsWith<AdminAuthorizeOnlyException> { sut.verify(anonymousLike, AdminRoles.USER) }
        assertFailsWith<AdminAuthorizeOnlyException> { sut.verifySuperAdmin(anonymousLike) }
    }

    @Test
    @DisplayName("allowedRoles 를 주지 않은 verify() 는 SUPER_ADMIN 전용이다")
    fun verify_WithoutAllowedRolesIsSuperAdminOnly() {
        // given — 인자를 빠뜨린 호출이 "누구나 통과"로 열리면 안 된다
        val manager = authInfo("MANAGER")
        val user = authInfo("USER")

        // when & then
        assertFailsWith<AdminAuthorizeOnlyException> { sut.verify(manager) }
        assertFailsWith<AdminAuthorizeOnlyException> { sut.verify(user) }
    }

    @Test
    @DisplayName("verifySuperAdmin() 은 MANAGER 도 차단한다")
    fun verifySuperAdmin_DeniesManager() {
        // given
        val manager = authInfo("MANAGER")

        // when & then
        assertFailsWith<AdminAuthorizeOnlyException> { sut.verifySuperAdmin(manager) }
    }

    @Test
    @DisplayName("인식되지 않는 역할 문자열만 가진 주체는 차단된다")
    fun verify_DeniesUnknownRoleStrings() {
        // given — "ADMIN", "ROLE_SUPER_ADMIN" 은 enum 에 없다
        val bogus = authInfo("ADMIN", "ROLE_SUPER_ADMIN", "MANAGER_")

        // when & then
        assertFailsWith<AdminAuthorizeOnlyException> { sut.verify(bogus, AdminRoles.MANAGER) }
        assertFailsWith<AdminAuthorizeOnlyException> { sut.verifySuperAdmin(bogus) }
    }

    @Test
    @DisplayName("DB 에 소문자로 적재된 SUPER_ADMIN 도 전권으로 통과한다")
    fun verify_AcceptsLowercaseSuperAdmin() {
        // given — AdminRoles.fromString 이 uppercase 정규화를 하므로 소문자도 매칭된다.
        //          역할 적재 시점에 정규화하지 않으면 이 경로로 예상 밖 승격이 일어난다.
        val lowercase = authInfo("super_admin")

        // when & then — 예외 없이 통과함을 고정한다
        sut.verifySuperAdmin(lowercase)
        sut.verify(lowercase, AdminRoles.MANAGER)
    }
}
