package com.hasterapi.auth.application

interface TokenGeneratorOutPort {
    fun generate(payload: Map<String, Any>, jti: String): String
}