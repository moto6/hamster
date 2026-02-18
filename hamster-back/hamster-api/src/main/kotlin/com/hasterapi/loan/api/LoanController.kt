package com.hasterapi.loan.api

import com.hasterapi.auth.api.AuthInfo
import com.hasterapi.auth.application.AuthPrincipal
import com.librarycore.loan.app.contract.LoanUseCase
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/library/v0/loans")
class LoanController(
    private val loanUseCase: LoanUseCase,
) {
    @GetMapping
    suspend fun getMyLoans(@AuthPrincipal authInfo: AuthInfo) = loanUseCase.findMyLoans(authInfo.userId)
}
