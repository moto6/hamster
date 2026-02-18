package com.librarycore.loan.app.contract

interface LoanUseCase {
    suspend fun findMyLoans(id: Any): Any
}