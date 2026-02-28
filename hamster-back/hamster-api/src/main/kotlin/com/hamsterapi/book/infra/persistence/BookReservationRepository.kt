package com.hamsterapi.book.infra.persistence

import com.hamsterapi.book.app.jpa.BookReservationRecord
import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface BookReservationRepository : CoroutineCrudRepository<BookReservationRecord, Long> {
}