package com.librarycore.loan.app.service

import com.librarycore.loan.app.contract.AdminLoanUseCase
import com.librarycore.loan.app.contract.LoanPersistenceOutPort
import com.librarycore.loan.app.contract.payload.ManageLoanQuery
import com.librarycore.loan.app.contract.payload.ManageLoanResult
import com.librarycore.loan.app.contract.payload.ManageOverdueResult

class AdminLoanService(
    private val loanPersistenceOutPort: LoanPersistenceOutPort,
): AdminLoanUseCase {
    override suspend fun findAllLoans(query: ManageLoanQuery): List<ManageLoanResult> {
        loanPersistenceOutPort.findLoansByQuery(ManageLoanQuery())
        TODO("Not yet implemented")
    }

    override suspend fun findOverdueLoans(): List<ManageOverdueResult> {
        loanPersistenceOutPort.findOverdueRecords()
        TODO("Not yet implemented")
    }
}