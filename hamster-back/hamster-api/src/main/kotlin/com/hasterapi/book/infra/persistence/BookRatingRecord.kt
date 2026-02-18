package com.hasterapi.book.app.jpa

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("book_rating")
data class BookRatingRecord(
    @Id val id: Long? = null,
    val bookSkuId: Long,
    val userId: Long,
    val rating: Int,
    val review: String?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)