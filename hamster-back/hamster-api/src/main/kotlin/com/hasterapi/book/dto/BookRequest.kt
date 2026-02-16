package com.hasterapi.book.dto

data class BookRequest(
    val isbn: String,
    val title: String,
    val quantity: Int
)