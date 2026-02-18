package com.librarycore.book.app.cotract

import collections.CursorPage
import com.librarycore.book.app.cotract.payload.BookSkuRegisterCommand
import com.librarycore.book.app.cotract.payload.BookSkuRegisterResult
import com.librarycore.book.app.cotract.payload.BookSkuResult
import com.librarycore.book.app.cotract.payload.BookSkuSearchQuery
import com.librarycore.book.app.cotract.payload.BookUpdateCommand


interface AdminBookSkuUseCase {
    suspend fun register(bookSkuRegisterCommand: BookSkuRegisterCommand) : BookSkuRegisterResult
    suspend fun update(id: Long, command: BookUpdateCommand): BookSkuResult
    suspend fun delete(id: Long)
    suspend fun listSkus(query: BookSkuSearchQuery): CursorPage<BookSkuResult>
}
