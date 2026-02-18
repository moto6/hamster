package com.hasterapi.config

import com.fasterxml.jackson.databind.exc.InvalidFormatException
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

    // 1. 최상위 부모 예외 (정의되지 않은 모든 에러)
    @ExceptionHandler(Exception::class)
    fun handleDefaultException(e: Exception): ResponseEntity<ErrorResponse> {
        log.error("Unhandled Exception: ${e.message}", e) // e를 넘겨야 스택트레이스가 찍힘
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(
                ErrorResponse(
                    code = "INTERNAL_SERVER_ERROR",
                    message = "서버 내부 오류가 발생했습니다.",
                    detail = e.message
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
            ErrorResponse(
                code = "BAD_REQUEST",
                message = "요청 본문을 읽을 수 없거나 형식이 잘못되었습니다.",
                detail = rootCause.message
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