package com.librarycore.loan;

import java.time.LocalDate;

public record LoanOverdue(
        String loanId,
        int overdueDays,
        LocalDate calculatedAt
) {}
