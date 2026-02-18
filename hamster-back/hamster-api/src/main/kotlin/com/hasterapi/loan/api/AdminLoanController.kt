package com.hasterapi.loan.api

import com.librarycore.loan.app.contract.AdminLoanUseCase
import com.librarycore.loan.app.contract.payload.ManageLoanQuery
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v0/library/admin/loans")
class AdminLoanController(
    private val adminLoanUseCase: AdminLoanUseCase
) {
    @GetMapping("/loans")
    suspend fun getAllLoans(query: ManageLoanQuery) = adminLoanUseCase.findAllLoans(query)

    @GetMapping("/overdue")
    suspend fun getOverdueList() = adminLoanUseCase.findOverdueLoans()
}
