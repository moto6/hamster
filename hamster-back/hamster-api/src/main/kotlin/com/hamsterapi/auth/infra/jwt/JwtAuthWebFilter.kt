package com.hamsterapi.auth.infra.jwt

import com.hamsterapi.auth.iam.service.JwtService
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.reactor.mono
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono

/**
 * Authorization: Bearer <access JWT> 가 있으면 검증하고 AuthInfo 를 exchange 속성에 바인딩한다.
 * 토큰이 없거나(익명) 형식이 틀리면 조용히 통과시키고, 실제 보호는 @AuthPrincipal 리졸버가
 * AuthInfo 부재 시 401(AuthenticationRequiredException) 로 강제한다(경로 화이트리스트 불필요).
 */
@Component
class JwtAuthWebFilter(
    private val jwtService: JwtService,
) : WebFilter {

    private val log: Logger = LoggerFactory.getLogger(JwtAuthWebFilter::class.java)

    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> = mono {
        val token = extractToken(exchange)
        if (token != null) {
            try {
                exchange.attributes[AuthContextKeys.AUTH_INFO] = jwtService.parse(token)
            } catch (e: Exception) {
                // 만료/위조 토큰: 익명으로 간주(속성 미설정) → 보호 핸들러에서 401.
                log.debug("token verify failed: {}", e.message)
            }
        }
        chain.filter(exchange).awaitSingleOrNull()
    }

    private fun extractToken(exchange: ServerWebExchange): String? =
        exchange.request.headers.getFirst("Authorization")
            ?.takeIf { it.startsWith("Bearer ") }
            ?.removePrefix("Bearer ")
            ?.trim()
}
