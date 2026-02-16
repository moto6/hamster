package com.hasterapi.adaptor.persistence

import com.hasterapi.adaptor.jpa.JpaBookSkuRepository
import com.librarycore.book.app.port.SaveBookSkuPort
import com.librarycore.book.domain.BookSku

class BookPersistenceAdapter(
    private val jpaRepository: JpaBookSkuRepository
) : SaveBookSkuPort {
    override fun save(bookSku: BookSku?) {
        TODO("Not yet implemented")
    }
}