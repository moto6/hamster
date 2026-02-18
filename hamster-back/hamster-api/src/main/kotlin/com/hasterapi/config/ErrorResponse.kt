package com.hasterapi.config

data class ErrorResponse(
    val code: String,
    val message: String,
    val detail: String?,
) {
}