package com.hamsterapi.book.infra.persistence.jpa

import com.librarycore.book.domain.BookInventoryStatus
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.LocalDateTime

@Entity
@Table(name = "book_inventory_detail")
class BookInventoryDetailEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_sku_id")
    var bookSku: BookSkuMasterEntity,

    @Enumerated(EnumType.STRING)
    var status: BookInventoryStatus = BookInventoryStatus.AVAILABLE,

    var createdAt: LocalDateTime = LocalDateTime.now(),
)
