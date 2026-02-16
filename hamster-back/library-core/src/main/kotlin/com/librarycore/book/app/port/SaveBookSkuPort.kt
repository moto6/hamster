package com.librarycore.book.app.port

import com.librarycore.book.domain.BookSku

interface SaveBookSkuPort {
    fun save(bookSku: BookSku?)
}
