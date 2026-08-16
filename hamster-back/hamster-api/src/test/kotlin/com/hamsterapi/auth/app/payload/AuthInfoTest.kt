package com.hamsterapi.auth.app.payload

import com.hamsterapi.auth.iam.domain.AdminRoles
import com.hamsterapi.auth.iam.domain.AuthType
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertTrue

/**
 * AuthInfo 는 요청 시점 인가 판정의 유일한 입력이다.
 * roles(문자열) → grantedRoles(enum) 변환에서 조용한 누락/과다 승격이 생기면 곧바로 보안 사고다.
 */
class AuthInfoTest {

    private fun authInfo(vararg roles: String) = AuthInfo(
        ldapId = "hong.gd",
        email = "hong.gd@hamster.io",
        displayName = "홍길동",
        roles = roles.toList(),
    )

    @Test
    @DisplayName("역할 문자열이 enum 으로 변환되고 hasRole 이 이를 판정한다")
    fun grantedRoles_MapsKnownRoles() {
        // given
        val auth = authInfo("USER", "MANAGER")

        // when & then
        assertEquals(setOf(AdminRoles.USER, AdminRoles.MANAGER), auth.grantedRoles)
        assertTrue(auth.hasRole(AdminRoles.MANAGER))
        assertFalse(auth.hasRole(AdminRoles.SUPER_ADMIN))
    }

    @Test
    @DisplayName("알 수 없는 역할 문자열은 예외 없이 조용히 버려진다")
    fun grantedRoles_SilentlyDropsUnknownRoles() {
        // given — 오타/폐기된 역할이 DB 에 남아 있어도 로그인은 계속돼야 한다
        val auth = authInfo("ADMIN", "ROLE_USER", "", "USER")

        // when & then — 다만 "ADMIN" 처럼 관리자로 착각하기 쉬운 값이 무시된다는 점을 인지해야 한다
        assertEquals(setOf(AdminRoles.USER), auth.grantedRoles)
        assertFalse(auth.hasRole(AdminRoles.SUPER_ADMIN))
    }

    @Test
    @DisplayName("역할 매칭은 대소문자를 구분하지 않는다 — 소문자 DB 값도 전권이 된다")
    fun grantedRoles_IsCaseInsensitive() {
        // given
        val auth = authInfo("super_admin")

        // when & then — 소문자로 잘못 적재된 값도 SUPER_ADMIN 으로 승격된다.
        //               데이터 정합성이 깨진 상태에서 권한이 확대되는 경로이므로 적재 시점 검증이 필요하다.
        assertTrue(auth.hasRole(AdminRoles.SUPER_ADMIN))
    }

    @Test
    @DisplayName("역할 문자열 양끝 공백은 매칭되지 않는다")
    fun grantedRoles_DoesNotTrim() {
        // given
        val auth = authInfo(" SUPER_ADMIN")

        // when & then — 반드시 toRoleList() 로 trim 된 값이 들어와야 한다는 계약을 고정
        assertFalse(auth.hasRole(AdminRoles.SUPER_ADMIN))
        assertTrue(auth.grantedRoles.isEmpty())
    }

    @Test
    @DisplayName("역할이 없으면 어떤 hasRole 검사도 통과하지 못한다")
    fun grantedRoles_EmptyByDefault() {
        // given
        val auth = authInfo()

        // when & then
        assertTrue(auth.grantedRoles.isEmpty())
        AdminRoles.entries.forEach { assertFalse(auth.hasRole(it), "[$it] 가 통과됐다") }
        assertFalse(auth.hasAnyRole(*AdminRoles.entries.toTypedArray()))
    }

    @Test
    @DisplayName("hasAnyRole(): 하나라도 보유하면 true, 인자가 없으면 false")
    fun hasAnyRole_RequiresAtLeastOneMatch() {
        // given
        val auth = authInfo("MANAGER")

        // when & then
        assertTrue(auth.hasAnyRole(AdminRoles.SUPER_ADMIN, AdminRoles.MANAGER))
        assertFalse(auth.hasAnyRole(AdminRoles.SUPER_ADMIN))
        assertFalse(auth.hasAnyRole(), "빈 인자는 어떤 권한도 요구하지 않은 것이므로 통과시키면 안 된다")
    }

    @Test
    @DisplayName("userId/username 은 기본적으로 ldapId 와 같다 (기준 식별자 일원화)")
    fun identifiers_DefaultToLdapId() {
        // given
        val auth = authInfo("USER")

        // when & then
        assertEquals("hong.gd", auth.ldapId)
        assertEquals("hong.gd", auth.userId)
        assertEquals("hong.gd", auth.username)
        assertEquals(AuthType.ACCESS_TOKEN, auth.authType)
        assertNull(auth.tokenId)
    }

    @Test
    @DisplayName("AdminRoles.fromString(): 알 수 없는 값은 null, 아는 값은 대소문자 무관 매칭")
    fun fromString_ResolvesKnownRolesOnly() {
        // given & when & then
        assertEquals(AdminRoles.SUPER_ADMIN, AdminRoles.fromString("super_admin"))
        assertEquals(AdminRoles.MANAGER, AdminRoles.fromString("Manager"))
        assertNull(AdminRoles.fromString("ADMIN"))
        assertNull(AdminRoles.fromString(""))
        assertNull(AdminRoles.fromString(" SUPER_ADMIN "))
    }
}
