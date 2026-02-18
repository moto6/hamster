package com.hasterapi.auth.application

interface TokenGeneratorPort {
    fun generate(payload: Map<String, Any>, jti: String): String
}