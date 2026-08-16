package com.hamsterapi.config

import com.hamsterapi.auth.idp.AuthProperties
import com.hamsterapi.auth.infra.jwt.AuthPrincipalArgumentResolver
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.config.CorsRegistry
import org.springframework.web.reactive.config.WebFluxConfigurer
import org.springframework.web.reactive.result.method.annotation.ArgumentResolverConfigurer

/**
 * WebFlux 설정: @AuthPrincipal 커스텀 리졸버 등록 + CORS.
 * AuthProperties(@ConfigurationProperties) 바인딩도 여기서 활성화한다.
 */
@Configuration
@EnableConfigurationProperties(AuthProperties::class)
class WebConfig(
    private val authPrincipalArgumentResolver: AuthPrincipalArgumentResolver,
    @Value("\${cors.allowed-origins:http://localhost:5173}")
    private val allowedOrigins: String,
) : WebFluxConfigurer {

    override fun configureArgumentResolvers(configurer: ArgumentResolverConfigurer) {
        configurer.addCustomResolver(authPrincipalArgumentResolver)
    }

    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/api/**")
            .allowedOrigins(*allowedOrigins.split(",").map { it.trim() }.toTypedArray())
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)  // refresh 쿠키(HttpOnly) 를 위해 필요
    }
}
