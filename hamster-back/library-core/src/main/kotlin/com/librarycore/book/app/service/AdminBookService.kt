package com.librarycore.book.app.service

import com.librarycore.book.app.port.RegisterBookSkuUseCase
import com.librarycore.book.app.port.SaveBookSkuPort
import com.librarycore.book.app.port.cmd.BookSkuRegisterCommand
import com.librarycore.book.domain.BookInventory
import com.librarycore.book.domain.BookSku
import identity.BookSkuId
import name.Isbn
import java.util.UUID

class AdminBookService(saveBookSkuPort: SaveBookSkuPort) : RegisterBookSkuUseCase {
    private val saveBookSkuPort: SaveBookSkuPort

    init {
        this.saveBookSkuPort = saveBookSkuPort
    }

    override fun register(bookSkuRegisterCommand: BookSkuRegisterCommand) {
        // 1. 도메인 객체 생성
        val bookSku = BookSku(
            BookSkuId(UUID.randomUUID().toString()),
            bookSkuRegisterCommand.title,
            "auth",
            Isbn(bookSkuRegisterCommand.isbn),
            ArrayList<BookInventory?>()
        )

        // 2. 비즈니스 로직 실행
        bookSku.addInventories(bookSkuRegisterCommand.quantity!!)

        // 3. 결과 저장 요청 (Port 호출)
        saveBookSkuPort.save(bookSku)
    }
}
