package com.librarycore.loan;

import java.time.LocalDate;

public record Loan(
        String loanId,
        String userId,
        String inventoryId,
        LocalDate loanDate,
        LocalDate dueDate,
        LoanStatus status
) {

    public Loan returned() {
        return new Loan(
                loanId,
                userId,
                inventoryId,
                loanDate,
                dueDate,
                LoanStatus.RETURNED
        );
    }

    public boolean isOverdue(LocalDate today) {
        return today.isAfter(dueDate) && status == LoanStatus.LOANED;
    }
}
