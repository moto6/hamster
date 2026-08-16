package com.hamsterapi.auth.support

import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

/**
 * roles 는 DB 에 CSV 로 저장된다. 이 변환이 깨지면 권한이 통째로 사라지거나 늘어나므로
 * 지저분한 입력(널/공백/중복/빈 토큰)에 대한 동작을 전부 고정한다.
 */
class RoleSupportTest {

    @Test
    @DisplayName("toRoleList(): null 과 빈 문자열은 빈 목록이다 (권한 없음)")
    fun toRoleList_HandlesNullAndBlank() {
        // given
        val inputs = listOf(null, "", "   ", ",", ",,,")

        // when & then — 여기서 예외가 나면 로그인 자체가 500 이 된다
        inputs.forEach { raw ->
            assertEquals(emptyList(), raw.toRoleList(), "입력 [$raw]")
        }
    }

    @Test
    @DisplayName("toRoleList(): 콤마 분리 후 공백을 제거한다")
    fun toRoleList_SplitsAndTrims() {
        // given
        val raw = " USER ,  SUPER_ADMIN ,MANAGER"

        // when
        val roles = raw.toRoleList()

        // then
        assertEquals(listOf("USER", "SUPER_ADMIN", "MANAGER"), roles)
    }

    @Test
    @DisplayName("toRoleList(): 빈 토큰은 버리고 순서는 유지한다")
    fun toRoleList_DropsEmptyTokensKeepsOrder() {
        // given
        val raw = "USER,,  ,SUPER_ADMIN,"

        // when
        val roles = raw.toRoleList()

        // then
        assertEquals(listOf("USER", "SUPER_ADMIN"), roles)
    }

    @Test
    @DisplayName("toRoleList(): 대소문자를 정규화하지 않는다 — DB 값이 그대로 흘러간다")
    fun toRoleList_DoesNotNormalizeCase() {
        // given
        val raw = "user,Super_Admin"

        // when
        val roles = raw.toRoleList()

        // then — 정규화는 AdminRoles.fromString 이 담당한다. 여기서 원본이 보존되어야
        //        어떤 값이 DB 에 들어있는지 로그/디버깅에서 판별할 수 있다.
        assertEquals(listOf("user", "Super_Admin"), roles)
    }

    @Test
    @DisplayName("toRoleCsv(): 중복을 제거하되 최초 등장 순서를 유지한다")
    fun toRoleCsv_DeduplicatesKeepingOrder() {
        // given
        val roles = listOf("USER", "SUPER_ADMIN", "USER", "SUPER_ADMIN")

        // when
        val csv = roles.toRoleCsv()

        // then
        assertEquals("USER,SUPER_ADMIN", csv)
    }

    @Test
    @DisplayName("toRoleCsv(): 빈 목록은 빈 문자열이고, 다시 읽으면 빈 목록이다")
    fun toRoleCsv_EmptyRoundTrips() {
        // given
        val roles = emptyList<String>()

        // when
        val csv = roles.toRoleCsv()

        // then
        assertEquals("", csv)
        assertEquals(emptyList(), csv.toRoleList())
    }

    @Test
    @DisplayName("정상 역할명은 CSV 왕복에서 값이 보존된다")
    fun roundTrip_PreservesValidRoles() {
        // given
        val roles = listOf("USER", "MANAGER", "SUPER_ADMIN")

        // when
        val restored = roles.toRoleCsv().toRoleList()

        // then
        assertEquals(roles, restored)
    }

    @Test
    @DisplayName("역할명에 콤마가 들어가면 CSV 왕복이 깨진다 — 구분자 이스케이프가 없다")
    fun roundTrip_BreaksOnCommaInsideRoleName() {
        // given — 역할 enum 에 콤마 포함 값이 추가되면 하나가 둘로 쪼개진다
        val roles = listOf("BOOK,ADMIN")

        // when
        val restored = roles.toRoleCsv().toRoleList()

        // then — 왕복 불변식이 성립하지 않는다. 역할명에 콤마를 쓰면 안 된다는 제약을 고정.
        assertEquals(listOf("BOOK", "ADMIN"), restored)
    }

    @Test
    @DisplayName("역할명 양끝 공백은 CSV 왕복에서 소실된다")
    fun roundTrip_TrimsSurroundingWhitespace() {
        // given
        val roles = listOf(" USER ")

        // when
        val restored = roles.toRoleCsv().toRoleList()

        // then
        assertEquals(listOf("USER"), restored)
    }
}
