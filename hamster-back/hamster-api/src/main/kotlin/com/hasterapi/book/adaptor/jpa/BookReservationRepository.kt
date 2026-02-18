package com.hasterapi.book.adaptor.jpa

import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface BookReservationRepository : CoroutineCrudRepository<BookReservationRecord, Long> {
}