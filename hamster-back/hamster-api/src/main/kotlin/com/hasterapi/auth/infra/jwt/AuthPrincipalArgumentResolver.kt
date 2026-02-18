package com.hasterapi.auth.infra.jwt

import com.hasterapi.auth.api.AuthInfo
import com.hasterapi.auth.application.AuthPrincipal
import org.springframework.core.MethodParameter
import org.springframework.stereotype.Component
import org.springframework.web.reactive.BindingContext
import org.springframework.web.reactive.result.method.HandlerMethodArgumentResolver
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

@Component
class AuthPrincipalArgumentResolver : HandlerMethodArgumentResolver {

    override fun supportsParameter(parameter: MethodParameter): Boolean =
        parameter.hasParameterAnnotation(AuthPrincipal::class.java) &&
                parameter.parameterType == AuthInfo::class.java

    override fun resolveArgument(
        parameter: MethodParameter,
        bindingContext: BindingContext,
        exchange: ServerWebExchange
    ): Mono<Any> {
        val authInfo = exchange.getAttribute<AuthInfo>(AuthContextKeys.AUTH_INFO)
            ?: return Mono.error(IllegalStateException("AuthInfo not found"))
        return Mono.just(authInfo)
    }
}
/*
@Component
class AuthPrincipalArgumentResolver : HandlerMethodArgumentResolver {

    override fun supportsParameter(parameter: MethodParameter): Boolean =
        parameter.hasParameterAnnotation(AuthPrincipal::class.java) &&
        parameter.parameterType == AuthPrincipal::class.java

    override fun resolveArgument(
        parameter: MethodParameter,
        bindingContext: BindingContext,
        exchange: ServerWebExchange
    ): Mono<Any> {
        val principal = exchange
            .getAttribute<AuthPrincipal>(AuthContextKeys.AUTH_PRINCIPAL)
            ?: return Mono.error(IllegalStateException("Unauthorized"))

        return Mono.just(principal)
    }
}
 */

/*

@GetMapping("/loans")
suspend fun getMyLoans(
    @AuthPrincipal auth: AuthPrincipal
) = loanUseCase.findMyLoans(auth.userId)
 */