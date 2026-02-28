package com.hasterapi.book.app

import com.hasterapi.book.infra.persistence.BookReservationRepository
import com.librarycore.book.app.cotract.ReservationOutPort
import com.librarycore.book.domain.BookReservation
import org.springframework.stereotype.Component

@Component
class BookReservationPersistAdaptor(
    private val repository: BookReservationRepository,
) : ReservationOutPort {
    override suspend fun saveBookReservation(bookReservation: BookReservation) {
        TODO("Not yet implemented")
    }
}