package com.librarycore.book.app.cotract

import collections.CursorPage
import com.librarycore.book.app.cotract.payload.BookSkuSearchQuery
import com.librarycore.book.app.cotract.payload.BookSkuSearchResult

interface SearchBookUseCase {
    suspend fun search(query: BookSkuSearchQuery): CursorPage<BookSkuSearchResult>
    suspend fun getDetail(isbn: String): BookSkuSearchResult
}