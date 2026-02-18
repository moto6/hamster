package com.librarycore.book.app.cotract.payload

import com.librarycore.book.domain.BookSku
import identity.BookSkuId
import name.Isbn

data class BookSkuRegisterResult(
    val bookSkuId: BookSkuId,
    val title: String,
    val author: String,
    val isbn: Isbn,
) {

    companion object {
        fun fromModel(bookSku: BookSku): BookSkuRegisterResult {
            return BookSkuRegisterResult(
                bookSkuId = bookSku.bookSkuId,
                title = bookSku.title,
                author = bookSku.author,
                isbn = bookSku.isbn
            )
        }
    }

}