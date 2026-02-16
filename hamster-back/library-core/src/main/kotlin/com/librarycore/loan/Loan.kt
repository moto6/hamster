package com.librarycore.loan

import java.time.LocalDate


@JvmRecord
data class Loan(
    val loanId: String,
    val userId: String,
    val inventoryId: String,
    val loanDate: LocalDate,
    val dueDate: LocalDate,
    val status: LoanStatus,
) {
    fun returned(): Loan {
        return Loan(
            loanId,
            userId,
            inventoryId,
            loanDate,
            dueDate,
            LoanStatus.RETURNED
        )
    }

    fun isOverdue(today: LocalDate): Boolean {
        return today.isAfter(dueDate) && status == LoanStatus.LOANED
    }
}
