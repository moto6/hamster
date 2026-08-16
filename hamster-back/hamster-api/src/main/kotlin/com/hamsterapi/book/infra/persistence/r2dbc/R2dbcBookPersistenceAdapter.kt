package com.hamsterapi.book.infra.persistence.r2dbc

import com.librarycore.book.app.cotract.BookOutPort
import com.librarycore.book.domain.BookInventoryStatus
import com.librarycore.book.domain.BookSku
import kotlinx.coroutines.flow.collect
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

/**
 * BookOutPort 의 R2DBC 구현. 기본(profile != jpa) 어댑터.
 *
 * JPA 구현([com.hamsterapi.book.infra.persistence.jpa.JpaBookPersistenceAdapter])과의 차이:
 *  - cascade 가 없다. 부모를 저장해 채번된 id 를 받아 자식을 직접 insert 한다.
 *  - suspend 함수에 @Transactional 을 걸면 리액티브 트랜잭션(R2dbcTransactionManager)이 잡힌다.
 *    스레드가 아니라 Reactor Context 를 타고 전파되므로 withContext 로 디스패처를 바꾸면 끊긴다.
 */
@Component
@Profile("!jpa")
class R2dbcBookPersistenceAdapter(
    private val skuRepository: BookSkuMasterRepository,
    private val inventoryRepository: BookInventoryDetailRepository,
) : BookOutPort {

    @Transactional
    override suspend fun saveSku(bookSku: BookSku) {
        val savedSku = skuRepository.save(BookSkuMasterRecord.from(bookSku))
        val skuId = checkNotNull(savedSku.id) { "book_sku_master 채번 실패" }

        val inventories = bookSku.inventories.map {
            BookInventoryDetailRecord(
                bookSkuId = skuId,
                status = BookInventoryStatus.from(it.status)
            )
        }
        inventoryRepository.saveAll(inventories).collect()
    }
}
