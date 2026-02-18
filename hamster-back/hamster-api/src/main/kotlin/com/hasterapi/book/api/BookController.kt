package com.hasterapi.book.api

import collections.CursorPage
import com.hasterapi.auth.api.AuthInfo
import com.hasterapi.auth.application.AuthPrincipal
import com.hasterapi.book.api.dto.ReserveRequest
import com.librarycore.book.app.cotract.ReservationUseCase
import com.librarycore.book.app.cotract.SearchBookUseCase
import com.librarycore.book.app.cotract.payload.BookSkuSearchQuery
import com.librarycore.book.app.cotract.payload.BookSkuSearchResult
import identity.UserId
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v0/library/books")
class BookController(
    private val searchBookUseCase: SearchBookUseCase,
    private val reservationUseCase: ReservationUseCase,
) {
    @GetMapping
    suspend fun search(params: BookSkuSearchQuery): CursorPage<BookSkuSearchResult> {
        return searchBookUseCase.search(params)
    }

    @GetMapping("/{isbn}")
    suspend fun getDetail(@PathVariable isbn: String): BookSkuSearchResult {
        return searchBookUseCase.getDetail(isbn)
    }

    @GetMapping("/reserve")
    suspend fun getMyReservations(@AuthPrincipal authInfo: AuthInfo) {
        reservationUseCase.findMyReservations(UserId(authInfo.userId))
    }

    @PostMapping("/reserve")
    suspend fun reserve(@RequestBody req: ReserveRequest) = reservationUseCase.reserve(req.toCommand())

    @DeleteMapping("/reserve/{id}")
    suspend fun cancel(@PathVariable id: Long) = reservationUseCase.cancel(id)
}