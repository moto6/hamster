package com.hamsterapi.book.app

import com.hamsterapi.book.app.jpa.BookSkuMasterRecord
import com.hamsterapi.book.infra.persistence.BookSkuMasterRepository
import com.librarycore.book.app.cotract.BookOutPort
import com.librarycore.book.domain.BookSku
import org.springframework.stereotype.Component

@Component
class BookPersistenceAdapter(
    private val repository: BookSkuMasterRepository
) : BookOutPort {
    override suspend fun saveSku(bookSku: BookSku) {
        println(bookSku.toString())
        repository.save(BookSkuMasterRecord.from(bookSku))
    }
}