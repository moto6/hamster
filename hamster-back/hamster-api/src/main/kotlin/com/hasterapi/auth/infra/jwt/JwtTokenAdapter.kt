package com.hasterapi.auth.infra.jwt

import com.hasterapi.auth.application.TokenGeneratorPort
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.Date

@Component
class JwtTokenAdapter(
    @Value("\${jwt.secret}") private val secretKey: String,
    @Value("\${jwt.expiration}") private val expiration: Long
) : TokenGeneratorPort {
    private val key = Keys.hmacShaKeyFor(secretKey.toByteArray())

    override fun generate(payload: Map<String, Any>, jti: String): String {
        return Jwts.builder()
            .claims(payload)
            .id(jti)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + expiration * 1000))
            .signWith(key)
            .compact()
    }
}