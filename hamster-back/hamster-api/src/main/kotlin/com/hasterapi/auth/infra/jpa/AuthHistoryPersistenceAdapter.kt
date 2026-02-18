package com.hasterapi.auth.infra.jpa

import com.hasterapi.auth.application.AuthHistoryPort
import org.springframework.stereotype.Component

@Component
class AuthHistoryPersistenceAdapter(
    private val repository: R2dbcAuthHistoryRepository
) : AuthHistoryPort {
    override suspend fun saveHistory(jti: String, issuer: String, token: String) {
        val entity = AuthHistoryEntity(
            authId = jti,
            issuer = issuer,
        )
        repository.save(entity)
    }
}