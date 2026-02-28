package com.librarycore.loan.app.service

import com.librarycore.loan.app.contract.LoanUseCase
import org.springframework.stereotype.Service

@Service
class LoanService(
//    private val loanPersistenceOutPort: LoanPersistenceOutPort,
) : LoanUseCase {
    override suspend fun findMyLoans(id: Any): Any {
//        loanPersistenceOutPort.findLoansByUserId(UserId("TBD"))
        TODO()
    }
}