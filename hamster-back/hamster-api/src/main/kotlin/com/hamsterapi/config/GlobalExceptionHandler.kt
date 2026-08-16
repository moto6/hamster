package com.hamsterapi.config

import com.fasterxml.jackson.databind.exc.InvalidFormatException
import com.hamsterapi.auth.iam.exception.UnauthorizedException
import com.hamsterapi.auth.support.AdminAuthorizeOnlyException
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.server.ServerWebInputException

@RestControllerAdvice
class GlobalExceptionHandler {

    private val log = LoggerFactory.getLogger(javaClass)

    // 0-a. 인증 실패 계열 → 401 (토큰 없음/만료/위조, refresh 실패 등)
    @ExceptionHandler(UnauthorizedException::class)
    fun handleUnauthorized(e: UnauthorizedException): ResponseEntity<ErrorResponse> {
        log.debug("Unauthorized: ${e.message}")
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            ErrorResponse(code = "UNAUTHORIZED", message = e.message ?: "인증이 필요합니다.", detail = null),
        )
    }

    // 0-b. RBAC 인가 실패 → 403
    @ExceptionHandler(AdminAuthorizeOnlyException::class)
    fun handleForbidden(e: AdminAuthorizeOnlyException): ResponseEntity<ErrorResponse> {
        log.debug("Forbidden: ${e.message}")
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
            ErrorResponse(code = "FORBIDDEN", message = e.message ?: "접근 권한이 없습니다.", detail = null),
        )
    }

    // 1. 최상위 부모 예외 (정의되지 않은 모든 에러)
    @ExceptionHandler(Exception::class)
    fun handleDefaultException(e: Exception): ResponseEntity<ErrorResponse> {
        log.error("Unhandled Exception: ${e.message}", e) // e를 넘겨야 스택트레이스가 찍힘
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(
                // 예외 원문은 로그에만. 클라이언트에는 상태코드 + 한 문장만 내려보낸다.
                ErrorResponse(
                    code = "INTERNAL_SERVER_ERROR",
                    message = "서버 내부 오류가 발생했습니다.",
                    detail = null
                )
            )
    }

    // 2. JSON 파싱 및 데이터 바인딩 에러 (WebFlux 스타일)
    @ExceptionHandler(ServerWebInputException::class)
    fun handleServerWebInputException(e: ServerWebInputException): ResponseEntity<ErrorResponse> {
        val rootCause = e.mostSpecificCause
        log.warn("JSON Decoding Error: ${rootCause.message}")

        // Enum 파싱 실패 케이스 처리
        if (rootCause is InvalidFormatException && rootCause.targetType.isEnum) {
            val fieldName = rootCause.path.joinToString(".") { it.fieldName ?: "[${it.index}]" }
            val enumValues = rootCause.targetType.enumConstants?.joinToString(", ") ?: "unknown"

            return ResponseEntity.badRequest().body(
                ErrorResponse(
                    code = "INVALID_ENUM_VALUE",
                    message = "필드 [$fieldName]의 값이 올바르지 않습니다.",
                    detail = "허용 가능한 값: [$enumValues]"
                )
            )
        }

        return ResponseEntity.badRequest().body(
            // Jackson 내부 메시지(클래스/필드 경로)가 새어나가지 않도록 원문은 로그에만 남긴다.
            ErrorResponse(
                code = "BAD_REQUEST",
                message = "요청 본문을 읽을 수 없거나 형식이 잘못되었습니다.",
                detail = null
            )
        )
    }

    // 3. 비즈니스 로직 예외 (IllegalArgumentException 등)
    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgumentException(e: IllegalArgumentException): ResponseEntity<ErrorResponse> {
        log.warn("Business Logic Restriction: ${e.message}")
        return ResponseEntity.badRequest().body(
            ErrorResponse(
                code = "BAD_REQUEST",
                message = e.message ?: "잘못된 요청입니다.",
                detail = "Business Rule Violation"
            )
        )
    }

    // 4. 404 처리 (Resource Not Found)
    @ExceptionHandler(ResponseStatusException::class)
    fun handleResponseStatusException(e: ResponseStatusException): ResponseEntity<ErrorResponse> {
        return ResponseEntity.status(e.statusCode).body(
            ErrorResponse(
                code = "NOT_FOUND",
                message = "요청하신 리소스를 찾을 수 없습니다.",
                detail = e.reason
            )
        )
    }
}