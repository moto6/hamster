package com.hasterapi.book.infra.persistence

import com.hasterapi.book.app.jpa.BookReservationRecord
import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface BookReservationRepository : CoroutineCrudRepository<BookReservationRecord, Long> {
}