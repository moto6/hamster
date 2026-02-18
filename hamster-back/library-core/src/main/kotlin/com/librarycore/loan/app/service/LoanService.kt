package com.librarycore.loan.app.service

import com.librarycore.loan.app.contract.LoanPersistenceOutPort
import com.librarycore.loan.app.contract.LoanUseCase
import identity.UserId

class LoanService(
    private val loanPersistenceOutPort: LoanPersistenceOutPort,
) : LoanUseCase {
    override suspend fun findMyLoans(id: Any): Any {
        loanPersistenceOutPort.findLoansByUserId(UserId("TBD"))
        TODO()
    }
}