package com.hasterapi.book.api.dto

import com.librarycore.book.app.cotract.payload.BookSkuRegisterCommand

data class BookRegisterRequest(
    val isbn: String,
    val title: String,
    val author: String,
    val publisherName: String,
    val quantity: Int
) {
    fun toCommand(): BookSkuRegisterCommand {
        return BookSkuRegisterCommand(
            this.isbn,
            this.title,
            this.author,
            this.publisherName,
            this.quantity,
        )
    }
}