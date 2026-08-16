package com.hamsterapi.book.infra.persistence.jpa

import com.librarycore.book.domain.BookSku
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

/**
 * JPA 블로킹 트랜잭션 경계.
 *
 * [JpaBookPersistenceAdapter] 와 분리한 이유가 두 가지 있다.
 *  1. suspend 함수에 @Transactional 을 걸면 스프링이 리액티브 트랜잭션으로 해석해
 *     ReactiveTransactionManager 를 찾는다. JPA 는 PlatformTransactionManager 라 맞지 않는다.
 *  2. 자기 호출(self-invocation)은 프록시를 타지 않아 @Transactional 이 먹지 않는다.
 *
 * 트랜잭션 매니저를 이름으로 지정한다 — jpa 프로파일에서는 R2DBC/JPA 두 개가 공존한다.
 */
@Component
@Profile("jpa")
class JpaBookWriter(
    private val skuRepository: BookSkuMasterJpaRepository,
) {
    @Transactional("jpaTransactionManager")
    fun saveSku(bookSku: BookSku) {
        // cascade = ALL 이라 부모 save 한 번에 book_inventory_detail 까지 함께 나간다.
        skuRepository.save(BookSkuMasterEntity.from(bookSku))
    }
}
