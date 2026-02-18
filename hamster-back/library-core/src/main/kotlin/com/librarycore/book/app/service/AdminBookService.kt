package com.librarycore.book.app.service

import collections.CursorPage
import com.librarycore.book.app.cotract.AdminBookSkuUseCase
import com.librarycore.book.app.cotract.BookOutPort
import com.librarycore.book.app.cotract.payload.BookSkuRegisterCommand
import com.librarycore.book.app.cotract.payload.BookSkuRegisterResult
import com.librarycore.book.app.cotract.payload.BookSkuResult
import com.librarycore.book.app.cotract.payload.BookSkuSearchQuery
import com.librarycore.book.app.cotract.payload.BookUpdateCommand
import com.librarycore.book.domain.BookSku
import identity.BookSkuId
import name.Isbn
import java.util.UUID

class AdminBookService(
    private val bookOutPort: BookOutPort,
) : AdminBookSkuUseCase {
    override suspend fun register(bookSkuRegisterCommand: BookSkuRegisterCommand): BookSkuRegisterResult {
        val bookSku = BookSku(
            BookSkuId(UUID.randomUUID().toString()),
            bookSkuRegisterCommand.title,
            "auth",
            Isbn(bookSkuRegisterCommand.isbn),
            ArrayList()
        )
        bookSku.addInventories(bookSkuRegisterCommand.quantity)
        bookOutPort.saveSku(bookSku)
        return BookSkuRegisterResult.fromModel(bookSku)
    }

    override suspend fun update(
        id: Long,
        command: BookUpdateCommand
    ): BookSkuResult {
        TODO("Not yet implemented")
    }

    override suspend fun delete(id: Long) {
        TODO("Not yet implemented")
    }

    override suspend fun listSkus(query: BookSkuSearchQuery): CursorPage<BookSkuResult> {
        TODO("Not yet implemented")
    }
}
