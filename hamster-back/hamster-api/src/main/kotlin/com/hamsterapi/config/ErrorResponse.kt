package com.hamsterapi.config

data class ErrorResponse(
    val code: String,
    val message: String,
    val detail: String?,
) {
}