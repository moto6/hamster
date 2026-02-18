package com.librarycore.book.app.service

import collections.CursorPage
import com.librarycore.book.app.cotract.ReservationUseCase
import com.librarycore.book.app.cotract.payload.UserReservationResult
import identity.UserId

class ReservationService: ReservationUseCase {
    override fun findMyReservations(userId: UserId): CursorPage<UserReservationResult> {
        TODO("Not yet implemented")
    }

    override fun reserve(toCommand: Any): Any {
        TODO("Not yet implemented")
    }

    override fun cancel(id: Long): Any {
        TODO("Not yet implemented")
    }

}