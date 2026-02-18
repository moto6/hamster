package com.hasterapi.book.adaptor.jpa

import com.librarycore.book.domain.BookSku
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("book_sku_master")
data class BookSkuMasterRecord(
    @Id val id: Long? = null,
    val isbn: String,
    val title: String,
    val author: String,
    val publisher: String?,
    val publishYear: Int?,
    val callNumber: String?,
    val category: String?,
    val description: String?,
    val coverImageUrl: String?,
    val totalCopies: Int = 0,
    val availableCopies: Int = 0,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
) {
    companion object {
        fun from(bookSku: BookSku): BookSkuMasterRecord {
            return BookSkuMasterRecord(
                isbn = bookSku.isbn.name,
                title = bookSku.title,
                author = bookSku.author,
                publisher = null,
                publishYear = null,
                callNumber = null,
                category = null,
                description = null,
                coverImageUrl = null,
                totalCopies = bookSku.inventories.size,
                availableCopies = 0,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            )
        }
    }
}