package com.hasterapi.book.adaptor.jpa

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("loan_overdue")
data class LoanOverdueRecord(
    @Id val id: Long? = null,
    val loanDetailId: Long,
    val overdueDays: Int,
    val fineAmount: Int,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)