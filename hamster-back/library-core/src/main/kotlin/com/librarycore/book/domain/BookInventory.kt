package com.librarycore.book.domain

import identity.BookInventoryId
import identity.BookSkuId

data class BookInventory(
    val bookInventoryId: BookInventoryId?,
    val bookSkuId: BookSkuId?,
    val status: BookStatus?
) {
    fun loaned(): BookInventory {
        return BookInventory(bookInventoryId, bookSkuId, BookStatus.LOANED)
    }

    fun available(): BookInventory {
        return BookInventory(bookInventoryId, bookSkuId, BookStatus.AVAILABLE)
    }
}