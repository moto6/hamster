package com.hasterapi.book.adaptor.persistence

import com.hasterapi.book.adaptor.jpa.JpaBookSkuRepository
import com.librarycore.book.app.port.SaveBookSkuPort
import com.librarycore.book.domain.BookSku

class BookPersistenceAdapter(
    private val jpaRepository: JpaBookSkuRepository
) : SaveBookSkuPort {
    override fun save(bookSku: BookSku?) {
        println(bookSku.toString())
    }
}