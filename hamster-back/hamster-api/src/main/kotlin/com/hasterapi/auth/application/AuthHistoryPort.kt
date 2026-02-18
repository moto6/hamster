package com.hasterapi.auth.application

interface AuthHistoryPort {
    suspend fun saveHistory(jti: String, issuer: String, token: String)
}