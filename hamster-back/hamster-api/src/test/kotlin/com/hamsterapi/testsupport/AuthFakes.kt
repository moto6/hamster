package com.hamsterapi.testsupport

import com.hamsterapi.auth.app.AuthHistoryOutPort
import com.hamsterapi.auth.infra.persistance.AccountRecord
import com.hamsterapi.auth.infra.persistance.AccountRepository
import com.hamsterapi.auth.infra.persistance.IdentityLinkRecord
import com.hamsterapi.auth.infra.persistance.IdentityLinkRepository
import com.hamsterapi.auth.infra.persistance.RefreshTokenRecord
import com.hamsterapi.auth.infra.persistance.RefreshTokenRepository
import java.time.LocalDateTime

class FakeAccountRepository :
    InMemoryCoroutineRepository<AccountRecord>(),
    AccountRepository {

    override fun idOf(entity: AccountRecord): Long? = entity.id

    override fun withId(entity: AccountRecord, id: Long): AccountRecord = entity.copy(id = id)

    override suspend fun findByLdapId(ldapId: String): AccountRecord? =
        rows().firstOrNull { it.ldapId == ldapId }
}

class FakeIdentityLinkRepository :
    InMemoryCoroutineRepository<IdentityLinkRecord>(),
    IdentityLinkRepository {

    override fun idOf(entity: IdentityLinkRecord): Long? = entity.id

    override fun withId(entity: IdentityLinkRecord, id: Long): IdentityLinkRecord = entity.copy(id = id)

    override suspend fun findByProviderAndSubject(provider: String, subject: String): IdentityLinkRecord? =
        rows().firstOrNull { it.provider == provider && it.subject == subject }
}

class FakeRefreshTokenRepository :
    InMemoryCoroutineRepository<RefreshTokenRecord>(),
    RefreshTokenRepository {

    override fun idOf(entity: RefreshTokenRecord): Long? = entity.id

    override fun withId(entity: RefreshTokenRecord, id: Long): RefreshTokenRecord = entity.copy(id = id)

    override suspend fun findByTokenHash(tokenHash: String): RefreshTokenRecord? =
        rows().firstOrNull { it.tokenHash == tokenHash }

    /** 실제 벌크 UPDATE 와 같게 family 전체를 폐기하고 영향 행 수를 돌려준다. */
    override suspend fun revokeFamily(familyId: String): Int {
        val targets = rows().filter { it.familyId == familyId && !it.revoked }
        targets.forEach { save(it.copy(revoked = true)) }
        return targets.size
    }
}

/** JWT 발급 감사 이력. 어떤 jti 가 기록·차단됐는지 검증용으로 노출한다. */
class FakeAuthHistoryOutPort : AuthHistoryOutPort {

    val issuedJtis = mutableListOf<String>()
    private val blocked = mutableSetOf<String>()

    override suspend fun saveHistory(jti: String, issuer: String, token: String) {
        issuedJtis += jti
    }

    override suspend fun blockToken(jti: String, expiresAt: LocalDateTime) {
        blocked += jti
    }

    override suspend fun isBlocked(jti: String): Boolean = jti in blocked
}
