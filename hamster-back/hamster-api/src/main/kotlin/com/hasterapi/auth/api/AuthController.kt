package com.hasterapi.auth.api

import com.hasterapi.auth.api.dto.JwtIssueRequest
import com.hasterapi.auth.api.dto.JwtIssueResponse
import com.hasterapi.auth.application.IssueTokenUseCase
import com.hasterapi.auth.application.impl.IssueTokenCommand
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth/v0")
class AuthController(
    private val issueTokenUseCase: IssueTokenUseCase
) {
    @PostMapping("/tokens")
    suspend fun issueToken(@RequestBody request: JwtIssueRequest): ResponseEntity<JwtIssueResponse> {
        val token = issueTokenUseCase.issue(request.toCommand())
        return ResponseEntity.ok()
            .header(HttpHeaders.AUTHORIZATION, "Bearer $token")
            .body(JwtIssueResponse(accessToken = token))
    }
}