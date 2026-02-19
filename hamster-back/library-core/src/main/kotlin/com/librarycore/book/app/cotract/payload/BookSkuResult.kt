package com.librarycore.book.app.cotract.payload

import java.time.LocalDate

data class BookSkuResult(
    val id: Long,
    val isbn: String,
    val title: String,
    val author: String,
    val publisher: String,
    val publishYear: Int,
    val callNumber: String,
    val category: String,
    val description: String,
    val coverImageUrl: String,
    val totalCopies: Int,
    val availableCopies: Int,
    val reservationCount: Int,
    val expectedReturnDate: LocalDate,
)