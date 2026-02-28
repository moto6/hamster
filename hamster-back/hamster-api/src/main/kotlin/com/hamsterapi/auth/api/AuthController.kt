package com.hamsterapi.auth.api

import com.hamsterapi.auth.api.dto.JwtIssueRequest
import com.hamsterapi.auth.api.dto.JwtIssueResponse
import com.hamsterapi.auth.app.AuthTokenPort
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v0/auth")
class AuthController(
    private val authTokenPort: AuthTokenPort,
) {
    @PostMapping("/tokens")
    suspend fun issueToken(@RequestBody request: JwtIssueRequest): ResponseEntity<JwtIssueResponse> {
        val token = authTokenPort.issue(request.toCommand())
        return ResponseEntity.ok()
            .header(HttpHeaders.AUTHORIZATION, "Bearer $token")
            .body(JwtIssueResponse(accessToken = token))
    }
}