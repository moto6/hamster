package com.librarycore.book.domain

enum class BookReservationStatus {
    PENDING,
    FULFILLED,
    EXPIRED,
    WAITING,
    AVAILABLE,
    CANCELLED,
    COMPLETED
}