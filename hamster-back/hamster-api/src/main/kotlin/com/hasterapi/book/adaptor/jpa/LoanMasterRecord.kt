package com.hasterapi.book.adaptor.jpa

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("loan_master")
data class LoanMasterRecord(
    @Id val id: Long? = null,
    val userId: Long,
    val loanDate: LocalDateTime = LocalDateTime.now(),
    val dueDate: LocalDateTime,
    val totalItems: Int = 1
)