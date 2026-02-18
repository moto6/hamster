package com.librarycore.book.app.cotract

import collections.CursorPage
import com.librarycore.book.app.cotract.payload.UserReservationResult
import identity.UserId

interface ReservationUseCase {
    fun findMyReservations(userId: UserId): CursorPage<UserReservationResult>
    fun reserve(toCommand: Any): Any
    fun cancel(id: Long): Any
}