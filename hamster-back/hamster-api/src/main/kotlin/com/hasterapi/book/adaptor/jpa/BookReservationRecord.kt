package com.hasterapi.book.adaptor.jpa

import com.librarycore.book.domain.BookReservationStatus
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("reservation")
data class BookReservationRecord(
    @Id val id: Long? = null,
    val userId: Long,
    val bookSkuId: Long,
    val reservationDate: LocalDateTime = LocalDateTime.now(),
    val availableDate: LocalDateTime? = null,
    val expiryDate: LocalDateTime? = null,
    val status: BookReservationStatus = BookReservationStatus.PENDING
)