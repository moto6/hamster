package com.hasterapi.auth.application

interface AuthHistoryOutPort {
    suspend fun saveHistory(jti: String, issuer: String, token: String)
    suspend fun blockToken(jti: String, expiresAt: java.time.LocalDateTime) // 차단 추가
    suspend fun isBlocked(jti: String): Boolean
}