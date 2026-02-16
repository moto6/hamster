package com.hasterapi.book

import com.hasterapi.book.dto.BookRequest
import com.librarycore.book.app.port.RegisterBookSkuUseCase
import com.librarycore.book.app.port.cmd.BookSkuRegisterCommand
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
            val bookSkuRegisterCommand = BookSkuRegisterCommand(
                request.isbn,
                request.title,
                request.quantity
            )
            registerUseCase.register(bookSkuRegisterCommand)
            ResponseEntity.ok("Success")
        }
}


