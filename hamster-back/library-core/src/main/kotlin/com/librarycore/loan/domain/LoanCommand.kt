package com.librarycore.loan

import java.time.LocalDate


@JvmRecord
data class LoanCommand(
    val loanId: String,
    val userId: String,
    val inventoryId: String,
    val loanDate: LocalDate,
    val dueDate: LocalDate,
    val status: LoanStatus,
) {
    fun returned(): LoanCommand {
        return LoanCommand(
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
