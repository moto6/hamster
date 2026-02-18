package com.librarycore.book.app.cotract

import com.librarycore.book.domain.BookReservation

interface ReservationOutPort {
    suspend fun saveBookReservation(bookReservation: BookReservation)
}
