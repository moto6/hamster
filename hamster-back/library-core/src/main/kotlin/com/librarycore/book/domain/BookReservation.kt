package com.librarycore.book.domain

import identity.BookReservationId
import identity.BookSkuId

class BookReservation(
    val bookReservationId: BookReservationId,
    val bookSkuId: BookSkuId,
    val status: BookReservationStatus,
) {
}