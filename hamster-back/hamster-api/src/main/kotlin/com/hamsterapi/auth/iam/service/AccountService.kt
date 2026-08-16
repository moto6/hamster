package com.hamsterapi.auth.iam.service

import com.hamsterapi.auth.app.payload.ExternalIdentity
import com.hamsterapi.auth.infra.persistance.AccountRecord
import com.hamsterapi.auth.infra.persistance.AccountRepository
import com.hamsterapi.auth.infra.persistance.IdentityLinkRecord
import com.hamsterapi.auth.infra.persistance.IdentityLinkRepository
import com.hamsterapi.auth.idp.AuthProperties
import com.hamsterapi.auth.support.toRoleCsv
import com.hamsterapi.auth.support.toRoleList
import org.springframework.stereotype.Service
import java.time.LocalDateTime

/**
 * 계정 원장 서비스. 외부 신원(ExternalIdentity)을 받아 Account 에 연결(JIT 프로비저닝)한다.
 * IDP 가 바뀌어도 같은 ldapId 로 같은 Account 에 이어진다(IdentityLink 추가만).
 */
@Service
class AccountService(
    private val accounts: AccountRepository,
    private val links: IdentityLinkRepository,
    private val props: AuthProperties,
) {

    suspend fun provision(ext: ExternalIdentity): AccountRecord {
        val link = links.findByProviderAndSubject(ext.provider.name, ext.subject)
        val account: AccountRecord = if (link != null) {
            accounts.findById(link.accountId) ?: throw NoSuchElementException("계정 없음")
        } else {
            // 기존 ldapId 계정에 합치거나(다른 IDP 로 이미 존재), 없으면 신규 생성
            val existing = accounts.findByLdapId(ext.ldapId)
            val acc = existing ?: accounts.save(
                AccountRecord(
                    ldapId = ext.ldapId,
                    email = ext.email,
                    displayName = ext.displayName,
                    department = ext.department,
                    roles = initialRoles(ext.ldapId),
                ),
            )
            links.save(IdentityLinkRecord(accountId = acc.id!!, provider = ext.provider.name, subject = ext.subject))
            acc
        }

        // 로그인 시 최신 신원 정보로 갱신 + 부트스트랩 슈퍼어드민 역할 보강
        val roleList = account.roles.toRoleList().toMutableList()
        if (account.ldapId in props.bootstrapSuperAdmins && "SUPER_ADMIN" !in roleList) {
            roleList.add("SUPER_ADMIN")
        }
        val updated = account.copy(
            email = ext.email ?: account.email,
            displayName = ext.displayName ?: account.displayName,
            department = ext.department ?: account.department,
            roles = roleList.toRoleCsv(),
            lastLoginAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now(),
        )
        return accounts.save(updated)
    }

    suspend fun loadById(id: Long): AccountRecord =
        accounts.findById(id) ?: throw NoSuchElementException("계정 없음: id=$id")

    suspend fun loadByLdapId(ldapId: String): AccountRecord =
        accounts.findByLdapId(ldapId) ?: throw NoSuchElementException("계정 없음: $ldapId")

    private fun initialRoles(ldapId: String): String =
        if (ldapId in props.bootstrapSuperAdmins) "USER,SUPER_ADMIN" else "USER"
}
