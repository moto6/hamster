package com.librarycore.loan

import java.time.LocalDate


@JvmRecord
data class LoanOverdue(
    val loanId: String,
    val loanDate: LocalDate,
    val expectedReturnDate: LocalDate,
)
