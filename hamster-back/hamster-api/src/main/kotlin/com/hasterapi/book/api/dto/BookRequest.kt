package com.hasterapi.book.api.dto

import com.librarycore.book.app.port.cmd.BookSkuRegisterCommand

data class BookRequest(
    val isbn: String,
    val title: String,
    val quantity: Int
) {
    fun toCommand(): BookSkuRegisterCommand {
        return BookSkuRegisterCommand(
            this.isbn,
            this.title,
            this.quantity
        )
    }
}