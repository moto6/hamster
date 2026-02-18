package com.hasterapi.book.api.dto

import com.librarycore.book.app.cotract.payload.BookSkuRegisterResult

data class BookRegisterResponse(
    val bookSkuId: String,
    val title: String,
    val author: String,
    val isbn: String,
) {
    companion object {
        fun fromResult(result: BookSkuRegisterResult): BookRegisterResponse {
            return BookRegisterResponse(
                bookSkuId = result.bookSkuId.id,
                title = result.title,
                author = result.author,
                isbn = result.isbn.name,
            )
        }
    }
}
