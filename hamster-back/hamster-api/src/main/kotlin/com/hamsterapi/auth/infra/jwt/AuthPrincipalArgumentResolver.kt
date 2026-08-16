package com.hamsterapi.auth.infra.jwt

import com.hamsterapi.auth.app.AuthPrincipal
import com.hamsterapi.auth.app.payload.AuthInfo
import com.hamsterapi.auth.iam.exception.AuthenticationRequiredException
import org.springframework.core.MethodParameter
import org.springframework.stereotype.Component
import org.springframework.web.reactive.BindingContext
import org.springframework.web.reactive.result.method.HandlerMethodArgumentResolver
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

/**
 * `@AuthPrincipal authInfo: AuthInfo` 파라미터를 해소한다.
 * WebFilter 가 바인딩한 AuthInfo 가 없으면(익명/만료) 401 → GlobalExceptionHandler.
 * WebConfig 에서 configureArgumentResolvers 로 등록해야 동작한다.
 */
@Component
class AuthPrincipalArgumentResolver : HandlerMethodArgumentResolver {

    override fun supportsParameter(parameter: MethodParameter): Boolean =
        parameter.hasParameterAnnotation(AuthPrincipal::class.java) &&
                parameter.parameterType == AuthInfo::class.java

    override fun resolveArgument(
        parameter: MethodParameter,
        bindingContext: BindingContext,
        exchange: ServerWebExchange,
    ): Mono<Any> {
        val authInfo = exchange.getAttribute<AuthInfo>(AuthContextKeys.AUTH_INFO)
            ?: return Mono.error(AuthenticationRequiredException())
        return Mono.just(authInfo)
    }
}
