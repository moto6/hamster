package com.librarycore.book.app.port.cmd

@JvmRecord
data class BookSkuRegisterCommand(
    val isbn: String,
    val title: String,
    val quantity: Int?
)
