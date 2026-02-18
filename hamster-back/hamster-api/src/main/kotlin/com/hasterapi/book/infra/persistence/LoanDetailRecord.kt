package com.hasterapi.book.app.jpa

import com.librarycore.loan.LoanStatus
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("loan_detail")
data class LoanDetailRecord(
    @Id val id: Long? = null,
    val loanMasterId: Long,
    val bookSkuId: Long,
    val inventoryId: Long,
    val returnDate: LocalDateTime? = null,
    val status: LoanStatus = LoanStatus.ACTIVE
)