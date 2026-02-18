package com.hasterapi.book.api.dto

import com.librarycore.book.app.cotract.payload.BookUpdateCommand

data class BookUpdateRequest(
    val foo: String = "demo"
) {
    fun toCommand():BookUpdateCommand {
        TODO("Not yet implemented")
    }
}
