package com.librarycore.book.app.service

import com.librarycore.book.app.cotract.AdminReservationUseCase
import com.librarycore.book.app.cotract.ReservationOutPort

class AdminReservationService(
    private val reservationOutPort: ReservationOutPort,
) : AdminReservationUseCase {
    override fun myReservations(query: Any): Any {
        //reservationOutPort.saveSku(BookSku())
        TODO("Not yet implemented")
    }
}