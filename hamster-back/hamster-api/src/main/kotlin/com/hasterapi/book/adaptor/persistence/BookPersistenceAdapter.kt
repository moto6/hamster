package com.hasterapi.book.adaptor.persistence

import com.hasterapi.book.adaptor.jpa.BookSkuMasterRecord
import com.hasterapi.book.adaptor.jpa.BookSkuMasterRepository
import com.librarycore.book.app.cotract.BookOutPort
import com.librarycore.book.domain.BookSku

class BookPersistenceAdapter(
    private val repository: BookSkuMasterRepository
) : BookOutPort {
    override suspend fun saveSku(bookSku: BookSku) {
        println(bookSku.toString())
        repository.save(BookSkuMasterRecord.from(bookSku))
    }
}