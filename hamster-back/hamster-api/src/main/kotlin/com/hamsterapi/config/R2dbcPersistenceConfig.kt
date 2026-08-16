package com.hamsterapi.config

import org.springframework.context.annotation.Configuration
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories

/**
 * R2DBC 리포지토리 스캔 범위를 명시한다.
 *
 * 원래는 오토컨피그가 @SpringBootApplication 기준 패키지 전체를 훑었지만,
 * JPA 리포지토리가 같은 트리 아래 생기면서 두 Spring Data 모듈이 같은 인터페이스를
 * 서로 자기 것이라고 주장할 여지가 생겼다. 스캔 범위를 직접 못박아 그 모호함을 없앤다.
 *
 * 새 R2DBC 리포지토리 패키지를 만들면 여기에 추가해야 한다.
 */
@Configuration
@EnableR2dbcRepositories(
    basePackages = [
        "com.hamsterapi.auth.infra.persistance",
        "com.hamsterapi.book.infra.persistence.r2dbc",
    ]
)
class R2dbcPersistenceConfig
