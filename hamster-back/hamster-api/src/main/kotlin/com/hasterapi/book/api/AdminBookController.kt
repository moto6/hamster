package com.hasterapi.book.api

import com.hasterapi.book.api.dto.BookRequest
import com.librarycore.book.app.port.RegisterBookSkuUseCase
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/library/v0/admin/books")
class AdminBookController(
    private val registerUseCase: RegisterBookSkuUseCase,
) {
    @PostMapping
    suspend fun registerBook(@RequestBody request: BookRequest): ResponseEntity<String> =
        withContext(Dispatchers.IO) {
            registerUseCase.register(request.toCommand())
            ResponseEntity.ok("Success")
        }
}


