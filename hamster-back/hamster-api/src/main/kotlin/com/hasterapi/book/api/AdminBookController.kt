package com.hasterapi.book.api

import com.hasterapi.book.api.dto.BookRegisterRequest
import com.hasterapi.book.api.dto.BookRegisterResponse
import com.hasterapi.book.api.dto.BookUpdateRequest
import com.librarycore.book.app.cotract.AdminBookSkuUseCase
import com.librarycore.book.app.cotract.AdminReservationUseCase
import com.librarycore.book.app.cotract.payload.BookSkuResult
import com.librarycore.book.app.cotract.payload.BookSkuSearchQuery
import com.librarycore.book.app.cotract.payload.ReservationQuery
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v0/library/admin/books")
class AdminBookController(
    private val bookSkuUseCase: AdminBookSkuUseCase,
    private val reservationUseCase: AdminReservationUseCase,
) {
    private val log: Logger = LoggerFactory.getLogger(AdminBookController::class.java)

    @PostMapping
    suspend fun registerBook(@RequestBody request: BookRegisterRequest): BookRegisterResponse {
        log.info("ee")
        val result = bookSkuUseCase.register(request.toCommand())
        return BookRegisterResponse.fromResult(result)
    }

    @GetMapping
    suspend fun getSkus(params: BookSkuSearchQuery): BookSkuResult {
        bookSkuUseCase.listSkus(params)
        TODO("")
    }

    @PutMapping("/{bookSkuId}")
    suspend fun update(@PathVariable bookSkuId: Long, @RequestBody req: BookUpdateRequest) =
        bookSkuUseCase.update(bookSkuId, req.toCommand())

    @DeleteMapping("/{id}")
    suspend fun delete(@PathVariable id: Long) = bookSkuUseCase.delete(id)

    @GetMapping("/reservations")
    suspend fun getAllReservations(query: ReservationQuery) = reservationUseCase.myReservations(query)
}


