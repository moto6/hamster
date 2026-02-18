package com.hasterapi.auth.application.impl

import com.hasterapi.auth.application.AuthHistoryOutPort
import com.hasterapi.auth.application.IssueTokenUseCase
import com.hasterapi.auth.application.TokenGeneratorOutPort
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class AuthService(
    private val tokenGenerator: TokenGeneratorOutPort,
    private val authHistoryOutPort: AuthHistoryOutPort,
) : IssueTokenUseCase {
    override suspend fun issue(command: IssueTokenCommand): String {
        val jti = UUID.randomUUID().toString()
        val payload = mapOf(
            "usr" to command.userId,
            "eml" to command.email,
            "dnm" to command.displayName
        )

        val token = tokenGenerator.generate(payload, jti)
        authHistoryOutPort.saveHistory(jti, command.userId, token)

        return token
    }
}