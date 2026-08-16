package com.hamsterapi.config

import com.zaxxer.hikari.HikariDataSource
import io.r2dbc.spi.ConnectionFactory
import jakarta.persistence.EntityManagerFactory
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.asCoroutineDispatcher
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.jdbc.autoconfigure.DataSourceProperties
import org.springframework.boot.persistence.autoconfigure.EntityScan
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.context.annotation.Profile
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.orm.jpa.JpaTransactionManager
import org.springframework.r2dbc.connection.R2dbcTransactionManager
import org.springframework.transaction.ReactiveTransactionManager
import org.springframework.transaction.PlatformTransactionManager
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

/**
 * 'jpa' 프로파일에서만 켜지는 JPA 스택. 실행: `--spring.profiles.active=local,jpa`
 *
 * R2DBC 를 끄지 않는다 — auth 는 계속 R2DBC 를 쓰고 BookOutPort 만 JPA 로 바뀐다.
 * 즉 두 스택이 한 컨텍스트에 공존하며, 이 설정의 대부분은 그 공존 비용을 처리하는 코드다.
 */
@Configuration
@Profile("jpa")
// SimpleJpaRepository 자체가 @Transactional 이라 트랜잭션 매니저를 찾는데, 기본 참조 이름이 "transactionManager" 다.
// 여기서는 R2DBC 쪽이 기본값이라 그 이름을 쓸 수 없으므로 참조를 명시한다.
@EnableJpaRepositories(
    basePackages = ["com.hamsterapi.book.infra.persistence.jpa"],
    transactionManagerRef = "jpaTransactionManager",
)
@EntityScan(basePackages = ["com.hamsterapi.book.infra.persistence.jpa"])
class JpaPersistenceConfig {

    /**
     * DataSource 를 직접 등록해야 한다.
     *
     * Boot 의 DataSourceAutoConfiguration 은 @ConditionalOnMissingBean(ConnectionFactory) 라서,
     * R2DBC ConnectionFactory 빈이 있으면 **의도적으로** 통째로 backs off 한다.
     * "리액티브를 골랐으면 블로킹 DataSource 는 만들지 않는다"는 Boot 의 방침이고,
     * 그 결과 두 스택 공존은 오토컨피그가 지원하지 않는 구성이 된다.
     * spring.datasource.url 을 아무리 넣어도 소용없고, 이렇게 손으로 만들어줘야
     * HibernateJpaAutoConfiguration 이 DataSource 를 찾아 EntityManagerFactory 를 만든다.
     */
    @Bean
    @ConfigurationProperties("spring.datasource")
    fun jpaDataSourceProperties(): DataSourceProperties = DataSourceProperties()

    @Bean
    @ConfigurationProperties("spring.datasource.hikari")
    fun dataSource(properties: DataSourceProperties): HikariDataSource =
        properties.initializeDataSourceBuilder().type(HikariDataSource::class.java).build()

    /**
     * 트랜잭션 매니저가 둘이 되면 한정자 없는 @Transactional 이
     * NoUniqueBeanDefinitionException 으로 깨진다(예: RefreshTokenService.rotate).
     * 기존 코드가 전부 리액티브이므로 R2DBC 쪽을 기본값으로 못박는다.
     * 빈 이름을 오토컨피그와 동일하게 두어 중복 등록을 피한다.
     */
    @Bean
    @Primary
    fun connectionFactoryTransactionManager(connectionFactory: ConnectionFactory): ReactiveTransactionManager =
        R2dbcTransactionManager(connectionFactory)

    /** JPA 는 이름으로 명시 지정해서만 쓴다. [com.hamsterapi.book.infra.persistence.jpa.JpaBookWriter] 참고. */
    @Bean
    fun jpaTransactionManager(entityManagerFactory: EntityManagerFactory): PlatformTransactionManager =
        JpaTransactionManager(entityManagerFactory)

    /**
     * 블로킹 JDBC 를 이벤트 루프 밖으로 내보내는 전용 디스패처.
     * 버추얼 스레드라 요청당 하나씩 만들어도 되고, 풀 크기를 튜닝할 대상이 아니다.
     * 실제 동시성 상한은 여기가 아니라 Hikari 풀 크기가 정한다.
     */
    @Bean(destroyMethod = "shutdown")
    fun jpaBlockingExecutor(): ExecutorService = Executors.newVirtualThreadPerTaskExecutor()

    @Bean
    fun jpaBlockingDispatcher(jpaBlockingExecutor: ExecutorService): CoroutineDispatcher =
        jpaBlockingExecutor.asCoroutineDispatcher()
}
