package com.librarycore.loan.app.contract

import com.librarycore.loan.domain.LoanCommand
import com.librarycore.loan.app.contract.payload.LoanOverdueResult
import com.librarycore.loan.app.contract.payload.LoanResult
import com.librarycore.loan.app.contract.payload.ManageLoanQuery
import com.librarycore.loan.app.contract.payload.ManageLoanResult
import identity.UserId

interface LoanPersistenceOutPort {
    suspend fun loan(loanCommand: LoanCommand): LoanResult
    suspend fun findLoansByQuery(query: ManageLoanQuery): List<ManageLoanResult>
    suspend fun findOverdueRecords(): List<LoanOverdueResult>
    suspend fun findLoansByUserId(userId: UserId): List<LoanResult>
}