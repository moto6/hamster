package com.librarycore.book.app.port

import com.librarycore.book.app.port.cmd.BookSkuRegisterCommand

interface RegisterBookSkuUseCase {
    fun register(bookSkuRegisterCommand: BookSkuRegisterCommand)
}
