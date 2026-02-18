package com.hasterapi.auth.application.impl

import com.hasterapi.auth.application.AuthHistoryPort
import com.hasterapi.auth.application.IssueTokenUseCase
import com.hasterapi.auth.application.TokenGeneratorPort
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class AuthService(
    private val tokenGenerator: TokenGeneratorPort,
    private val authHistoryPort: AuthHistoryPort,
) : IssueTokenUseCase {
    override suspend fun issue(command: IssueTokenCommand): String {
        val jti = UUID.randomUUID().toString()
        val payload = mapOf(
            "usr" to command.ldap,
            "eml" to command.email,
            "dnm" to command.displayName
        )

        val token = tokenGenerator.generate(payload, jti)
        authHistoryPort.saveHistory(jti, command.ldap, token)

        return token
    }
}