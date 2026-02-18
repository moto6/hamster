package com.librarycore.loan.app.contract

import com.librarycore.loan.app.contract.payload.ManageLoanQuery
import com.librarycore.loan.app.contract.payload.ManageLoanResult
import com.librarycore.loan.app.contract.payload.ManageOverdueResult

interface AdminLoanUseCase {
    suspend fun findAllLoans(query: ManageLoanQuery): List<ManageLoanResult>
    suspend fun findOverdueLoans(): List<ManageOverdueResult>
}