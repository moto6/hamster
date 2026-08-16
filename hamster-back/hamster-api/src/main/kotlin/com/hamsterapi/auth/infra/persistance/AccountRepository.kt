package com.hamsterapi.auth.infra.persistance

import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface AccountRepository : CoroutineCrudRepository<AccountRecord, Long> {
    suspend fun findByLdapId(ldapId: String): AccountRecord?
}
