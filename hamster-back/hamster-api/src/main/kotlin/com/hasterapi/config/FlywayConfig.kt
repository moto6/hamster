package com.hasterapi.config

import org.flywaydb.core.Flyway
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(FlywayCustomProperties::class)
class FlywayConfig(
    private val props: FlywayCustomProperties
) {
    @Bean(initMethod = "migrate")
    fun flyway(): Flyway =
        Flyway.configure()
            .dataSource(
                props.url,
                props.user,
                props.password
            )
            .locations(props.path)
            .baselineOnMigrate(props.baselineOnMigrate)
            .load()
}