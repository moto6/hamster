package com.hamsterapi.loan.app

import com.librarycore.loan.app.contract.LoanPersistenceOutPort
import com.librarycore.loan.app.contract.payload.LoanOverdueResult
import com.librarycore.loan.app.contract.payload.LoanResult
import com.librarycore.loan.app.contract.payload.ManageLoanQuery
import com.librarycore.loan.app.contract.payload.ManageLoanResult
import com.librarycore.loan.domain.LoanCommand
import identity.UserId
import org.springframework.stereotype.Component

@Component
class LoanPersistenceAdaptor : LoanPersistenceOutPort {
    override suspend fun loan(loanCommand: LoanCommand): LoanResult {
        TODO("Not yet implemented")
    }

    override suspend fun findLoansByQuery(query: ManageLoanQuery): List<ManageLoanResult> {
        TODO("Not yet implemented")
    }

    override suspend fun findOverdueRecords(): List<LoanOverdueResult> {
        TODO("Not yet implemented")
    }

    override suspend fun findLoansByUserId(userId: UserId): List<LoanResult> {
        TODO("Not yet implemented")
    }
}