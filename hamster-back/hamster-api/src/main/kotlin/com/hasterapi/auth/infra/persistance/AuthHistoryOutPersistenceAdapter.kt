package com.hasterapi.auth.infra.persistance

import com.hasterapi.auth.app.AuthHistoryOutPort
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class AuthHistoryOutPersistenceAdapter(
    private val repository: AuthHistoryRepository
) : AuthHistoryOutPort {
    override suspend fun saveHistory(jti: String, issuer: String, token: String) {
        val entity = AuthHistoryRecord(
            authId = jti,
            issuer = issuer,
        )
        repository.save(entity)
    }

    override suspend fun blockToken(jti: String, expiresAt: LocalDateTime) {
        TODO("Not yet implemented")
    }

    override suspend fun isBlocked(jti: String): Boolean {
        TODO("Not yet implemented")
    }
}