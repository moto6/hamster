package com.hamsterapi.auth.infra.persistance

import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface IdentityLinkRepository : CoroutineCrudRepository<IdentityLinkRecord, Long> {
    suspend fun findByProviderAndSubject(provider: String, subject: String): IdentityLinkRecord?
}
