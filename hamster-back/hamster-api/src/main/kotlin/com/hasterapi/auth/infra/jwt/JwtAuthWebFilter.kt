package com.hasterapi.auth.infra.jwt

import com.hasterapi.auth.app.AuthTokenPort
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.reactor.mono
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono

@Component
class JwtAuthWebFilter(
    private val authTokenPort: AuthTokenPort
) : WebFilter {

    private val log: Logger = LoggerFactory.getLogger(JwtAuthWebFilter::class.java)

    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> = mono {
        val token = extractToken(exchange)
        if (token != null) {
            try {
                val authInfo = authTokenPort.verify(token)
                exchange.attributes[AuthContextKeys.AUTH_INFO] = authInfo
            } catch (e: Exception) {
                log.error("Failed to verify token: {}", e.message, e)
            }
        }
        chain.filter(exchange).awaitSingleOrNull()
    }


    private fun extractToken(exchange: ServerWebExchange): String? =
        exchange.request.headers.getFirst("Authorization")
            ?.removePrefix("Bearer ")
}