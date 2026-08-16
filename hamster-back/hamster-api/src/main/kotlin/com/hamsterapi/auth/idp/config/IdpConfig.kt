package com.hamsterapi.auth.idp.config

import com.hamsterapi.auth.idp.AuthProperties
import com.hamsterapi.auth.idp.infra.IdentityProvider
import com.hamsterapi.auth.idp.infra.impl.MockIdentityProvider
import com.hamsterapi.auth.idp.infra.impl.SsoIdentityProvider
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment
import org.springframework.web.reactive.function.client.WebClient
import tools.jackson.databind.ObjectMapper

/**
 * 활성 IDP 어댑터 선택 (auth.idp = mock | sso). IDP 교체는 여기서 빈만 바꾸면 된다 — 코어 무손상.
 */
@Configuration
class IdpConfig {

    private val log = LoggerFactory.getLogger(IdpConfig::class.java)

    @Bean
    fun identityProvider(
        props: AuthProperties,
        environment: Environment,
        objectMapper: ObjectMapper,
    ): IdentityProvider {
        val idp = props.idp.lowercase()

        // Mock IDP 는 자격증명 없이 admin.demo(=SUPER_ADMIN) 로 로그인시킨다. 설정 실수로 운영에
        // 새어 들어가면 인증이 통째로 무력화되므로, prod 프로파일에서는 기동을 막는다.
        if (idp == "mock" && environment.matchesProfiles("prod")) {
            throw IllegalStateException(
                "prod 프로파일에서 auth.idp=mock 은 사용할 수 없습니다. AUTH_IDP=sso 로 설정하십시오.",
            )
        }

        log.info("Active IDP = {} (profiles={})", idp, environment.activeProfiles.joinToString(","))
        return when (idp) {
            // WebClient.Builder 는 Spring Boot 4 에서 자동 구성되지 않으므로 직접 생성한다.
            "sso" -> SsoIdentityProvider(props, WebClient.create(), objectMapper)
            "mock" -> MockIdentityProvider(props)
            else -> throw IllegalStateException("알 수 없는 auth.idp 값: ${props.idp} (mock|sso)")
        }
    }
}
