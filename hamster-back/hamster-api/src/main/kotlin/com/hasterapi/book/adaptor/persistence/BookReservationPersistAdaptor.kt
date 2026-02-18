package com.hasterapi.book.adaptor.persistence

import com.hasterapi.book.adaptor.jpa.BookReservationRepository
import com.librarycore.book.app.cotract.ReservationOutPort
import com.librarycore.book.domain.BookReservation

class BookReservationPersistAdaptor(
    private val repository: BookReservationRepository,
) : ReservationOutPort {
    override suspend fun saveBookReservation(bookReservation: BookReservation) {
        TODO("Not yet implemented")
    }
}