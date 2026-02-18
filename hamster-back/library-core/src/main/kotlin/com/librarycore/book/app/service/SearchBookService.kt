package com.librarycore.book.app.service

import collections.CursorPage
import com.librarycore.book.app.cotract.SearchBookUseCase
import com.librarycore.book.app.cotract.payload.BookSkuSearchQuery
import com.librarycore.book.app.cotract.payload.BookSkuSearchResult

class SearchBookService : SearchBookUseCase{
    override suspend fun search(query: BookSkuSearchQuery): CursorPage<BookSkuSearchResult> {
        TODO("Not yet implemented")
    }

    override suspend fun getDetail(isbn: String): BookSkuSearchResult {
        TODO("Not yet implemented")
    }
}