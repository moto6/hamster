package com.hamsterapi.loan.api


import com.hamsterapi.auth.app.AuthPrincipal
import com.hamsterapi.auth.app.payload.AuthInfo
import com.librarycore.loan.app.contract.LoanUseCase
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v0/library/loans")
class LoanController(
    private val loanUseCase: LoanUseCase,
) {
    @GetMapping
    suspend fun getMyLoans(@AuthPrincipal authInfo: AuthInfo) = loanUseCase.findMyLoans(authInfo.userId)
}
