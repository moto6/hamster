package com.hasterapi.book.adaptor.jpa

import com.librarycore.book.domain.BookInventoryStatus
import identity.BookInventoryId
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("book_inventory_detail")
data class BookInventoryDetailRecord(
    @Id val pk: Long? = null,
    val bookInventoryId: BookInventoryId,
    val bookSkuId: Long,
    val status: BookInventoryStatus = BookInventoryStatus.AVAILABLE
)