package com.librarycore.book.domain

import identity.BookInventoryId
import identity.BookSkuId
import name.Isbn

data class BookSku(
    val bookSkuId: BookSkuId,
    val title: String,
    val author: String,
    val isbn: Isbn,
    val inventories: MutableList<BookInventory>,

) {
    fun addInventories(quantity: Int) {
        require(quantity > 0) { "수량은 0보다 커야 합니다." }
        for (i in 0..<quantity) {
            this.inventories!!.add(
                BookInventory(
                    BookInventoryId.create(),
                    this.bookSkuId,
                    BookStatus.AVAILABLE
                )
            )
        }
    }
}