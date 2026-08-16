package com.hamsterapi.book.infra.persistence.r2dbc

import com.librarycore.book.domain.BookInventoryStatus
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

// 도메인 BookInventory 는 UUID(BookInventoryId) 를 쓰지만 book_inventory_detail 에는 대응 컬럼이 없다.
// 스키마(V1)를 기준으로 맞춘다 — 식별자는 DB 채번 BIGINT 한 종류뿐.
@Table("book_inventory_detail")
data class BookInventoryDetailRecord(
    @Id val id: Long? = null,
    val bookSkuId: Long,
    val status: BookInventoryStatus = BookInventoryStatus.AVAILABLE
)
