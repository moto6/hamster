package com.librarycore.loan.domain

import java.time.LocalDate

data class LoanOverdue(
    val loanId: String,
    val loanDate: LocalDate,
    val expectedReturnDate: LocalDate,
)
