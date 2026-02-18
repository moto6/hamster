package com.librarycore.book.app.cotract.payload

data class BookSkuRegisterCommand(
    val isbn: String,
    val title: String,
    val author: String,
    val publisherName: String,
    val quantity: Int,
)
