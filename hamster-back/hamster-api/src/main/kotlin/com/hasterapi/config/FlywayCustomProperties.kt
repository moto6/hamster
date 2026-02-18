package com.hasterapi.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "custom.flyway")
data class FlywayCustomProperties(
    val url: String,
    val user: String,
    val password: String,
    val path: String,
    val baselineOnMigrate: Boolean
)

//@Configuration
//class FlywayCustomProperties(
//    @Value("\${custom.flyway.url}") private val url: String,
//    @Value("\${custom.flyway.user}") private val user: String,
//    @Value("\${custom.flyway.password}") private val password: String,
//    @Value("\${custom.flyway.path}") private val path: String,
//    @Value("\${custom.flyway.baseline-on-migrate}") private val baseLineOnMigrate: Boolean,
//
//    ) {
//custom:
//  flyway:
//    url: r2dbc:postgresql://localhost:5432/library
//    user: localuser
//    password: localpass
//    locations: classpath:db/migration
//    baseline-on-migrate: true

//    @Bean(initMethod = "migrate")
//    fun flyway(): Flyway =
//        Flyway.configure()
//            .dataSource(
//                url,
//                user,
//                password,
//            )
//            .locations(path)
//            .baselineOnMigrate(baseLineOnMigrate)
//            .load()
//}