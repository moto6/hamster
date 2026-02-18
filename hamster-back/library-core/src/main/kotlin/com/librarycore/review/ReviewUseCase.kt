package com.librarycore.review

interface ReviewUseCase {
    fun getRatingStats(isbn: String): Any
    fun write(toCommand: Any): Any
    fun update(id: Long, toCommand: Any): Any
    fun delete(id: Long): Any
}
