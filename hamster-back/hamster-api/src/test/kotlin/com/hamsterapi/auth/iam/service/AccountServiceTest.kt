package com.hamsterapi.auth.iam.service

import com.hamsterapi.auth.app.payload.ExternalIdentity
import com.hamsterapi.auth.idp.AuthProperties
import com.hamsterapi.auth.idp.domain.IdpProvider
import com.hamsterapi.auth.infra.persistance.IdentityLinkRecord
import com.hamsterapi.auth.support.toRoleList
import com.hamsterapi.testsupport.FakeAccountRepository
import com.hamsterapi.testsupport.FakeIdentityLinkRepository
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

/**
 * JIT 프로비저닝. 여기서 계정이 중복 생성되거나 역할이 잘못 부여되면
 * "같은 사람인데 권한이 다른 계정"이 생겨 인가 판정 전체가 신뢰를 잃는다.
 */
class AccountServiceTest {

    private val accounts = FakeAccountRepository()
    private val links = FakeIdentityLinkRepository()
    private val props = AuthProperties(bootstrapSuperAdmins = listOf("admin.demo"))
    private val sut = AccountService(accounts, links, props)

    private fun identity(
        ldapId: String = "hong.gd",
        provider: IdpProvider = IdpProvider.SSO,
        subject: String = ldapId,
        email: String? = "hong.gd@hamster.io",
        displayName: String? = "홍길동",
        department: String? = "개발팀",
    ) = ExternalIdentity(provider, subject, ldapId, email, displayName, department)

    @Test
    @DisplayName("최초 로그인: 계정과 IDP 연결이 함께 생성되고 기본 역할은 USER 다")
    fun provision_CreatesAccountAndLinkOnFirstLogin() = runTest {
        // given
        val ext = identity()

        // when
        val account = sut.provision(ext)

        // then
        assertEquals(1, accounts.rows().size)
        assertEquals(1, links.rows().size)
        assertEquals("hong.gd", account.ldapId)
        assertEquals(listOf("USER"), account.roles.toRoleList())
        assertNotNull(account.lastLoginAt, "로그인 시각이 기록되지 않았다")
        assertEquals(account.id, links.rows().single().accountId)
    }

    @Test
    @DisplayName("재로그인: 계정도 연결도 중복 생성되지 않는다")
    fun provision_IsIdempotentAcrossLogins() = runTest {
        // given
        val ext = identity()
        val first = sut.provision(ext)

        // when
        val second = sut.provision(ext)
        sut.provision(ext)

        // then
        assertEquals(first.id, second.id)
        assertEquals(1, accounts.rows().size, "재로그인마다 계정이 늘어난다")
        assertEquals(1, links.rows().size, "재로그인마다 연결이 늘어난다")
    }

    @Test
    @DisplayName("같은 ldapId 를 쓰는 다른 IDP 로 로그인하면 기존 계정에 연결만 추가된다")
    fun provision_MergesSecondIdpIntoSameAccount() = runTest {
        // given — IDP 교체/병행 운영 시나리오
        val viaSso = sut.provision(identity(provider = IdpProvider.SSO, subject = "sso-sub"))

        // when
        val viaGoogle = sut.provision(identity(provider = IdpProvider.GOOGLE, subject = "google-sub"))

        // then
        assertEquals(viaSso.id, viaGoogle.id, "같은 사람이 계정 두 개로 갈라졌다")
        assertEquals(1, accounts.rows().size)
        assertEquals(2, links.rows().size)
    }

    @Test
    @DisplayName("bootstrapSuperAdmins 계정은 최초 생성 시 SUPER_ADMIN 을 함께 받는다")
    fun provision_BootstrapsSuperAdmin() = runTest {
        // given
        val ext = identity(ldapId = "admin.demo")

        // when
        val account = sut.provision(ext)

        // then
        assertEquals(listOf("USER", "SUPER_ADMIN"), account.roles.toRoleList())
    }

    @Test
    @DisplayName("bootstrap 계정은 권한을 회수해도 다음 로그인에 SUPER_ADMIN 이 되살아난다")
    fun provision_ReAddsSuperAdminAfterManualRemoval() = runTest {
        // given — 운영자가 DB 에서 SUPER_ADMIN 을 지운 상태
        val created = sut.provision(identity(ldapId = "admin.demo"))
        accounts.save(created.copy(roles = "USER"))

        // when
        val relogin = sut.provision(identity(ldapId = "admin.demo"))

        // then — 설정에서 ldapId 를 빼지 않는 한 권한 회수가 불가능하다는 사실을 고정한다.
        assertTrue(relogin.roles.toRoleList().contains("SUPER_ADMIN"))
    }

    @Test
    @DisplayName("일반 계정에 부여된 역할은 로그인해도 유지된다")
    fun provision_PreservesGrantedRoles() = runTest {
        // given
        val created = sut.provision(identity())
        accounts.save(created.copy(roles = "USER,MANAGER"))

        // when
        val relogin = sut.provision(identity())

        // then
        assertEquals(listOf("USER", "MANAGER"), relogin.roles.toRoleList())
    }

    @Test
    @DisplayName("역할 CSV 는 재로그인을 반복해도 중복이 쌓이지 않는다")
    fun provision_DoesNotAccumulateDuplicateRoles() = runTest {
        // given
        val ext = identity(ldapId = "admin.demo")

        // when
        repeat(5) { sut.provision(ext) }

        // then
        val roles = accounts.rows().single().roles.toRoleList()
        assertEquals(roles.distinct(), roles, "역할이 중복 누적됐다: $roles")
    }

    @Test
    @DisplayName("IDP 가 값을 주지 않은 필드는 기존 값을 덮어쓰지 않는다")
    fun provision_DoesNotWipeExistingProfileWithNulls() = runTest {
        // given
        sut.provision(identity(email = "hong.gd@hamster.io", displayName = "홍길동", department = "개발팀"))

        // when — 두 번째 IDP 응답에 프로필이 빠져 있는 경우
        val updated = sut.provision(identity(email = null, displayName = null, department = null))

        // then
        assertEquals("hong.gd@hamster.io", updated.email)
        assertEquals("홍길동", updated.displayName)
        assertEquals("개발팀", updated.department)
    }

    @Test
    @DisplayName("IDP 가 값을 주면 최신 프로필로 갱신된다")
    fun provision_RefreshesProfileFromIdp() = runTest {
        // given
        sut.provision(identity(department = "개발팀"))

        // when
        val updated = sut.provision(identity(displayName = "홍길동(팀장)", department = "플랫폼팀"))

        // then
        assertEquals("홍길동(팀장)", updated.displayName)
        assertEquals("플랫폼팀", updated.department)
    }

    @Test
    @DisplayName("연결은 있는데 계정이 사라졌으면 조용히 새로 만들지 않고 실패한다")
    fun provision_FailsWhenLinkedAccountMissing() = runTest {
        // given — 계정만 삭제된 정합성 깨진 상태
        links.save(IdentityLinkRecord(accountId = 999L, provider = IdpProvider.SSO.name, subject = "hong.gd"))

        // when & then — 조용히 신규 계정을 만들면 권한 이력이 통째로 사라진다
        assertFailsWith<NoSuchElementException> { sut.provision(identity()) }
    }

    @Test
    @DisplayName("loadById/loadByLdapId: 없는 계정은 NoSuchElementException 이다")
    fun load_ThrowsForUnknownAccount() = runTest {
        // given
        val created = sut.provision(identity())

        // when & then
        assertEquals(created.id, sut.loadById(created.id!!).id)
        assertEquals(created.id, sut.loadByLdapId("hong.gd").id)
        assertFailsWith<NoSuchElementException> { sut.loadById(9999L) }
        assertFailsWith<NoSuchElementException> { sut.loadByLdapId("없는사람") }
    }

    @Test
    @DisplayName("동일 subject 라도 provider 가 다르면 별개의 연결로 취급한다")
    fun provision_ScopesSubjectByProvider() = runTest {
        // given — subject 는 IDP 내부에서만 유일하다. 전역 유일로 착각하면 계정이 섞인다.
        sut.provision(identity(ldapId = "hong.gd", provider = IdpProvider.SSO, subject = "1001"))

        // when
        sut.provision(identity(ldapId = "kim.cs", provider = IdpProvider.GOOGLE, subject = "1001"))

        // then
        assertEquals(2, accounts.rows().size)
        assertEquals(2, links.rows().size)
    }
}
