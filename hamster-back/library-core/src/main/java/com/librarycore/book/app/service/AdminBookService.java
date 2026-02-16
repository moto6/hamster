package com.librarycore.book.app.service;

import com.librarycore.book.app.port.RegisterBookSkuUseCase;
import com.librarycore.book.app.port.SaveBookSkuPort;
import com.librarycore.book.app.port.cmd.BookSkuRegisterCommand;
import com.librarycore.book.domain.BookSku;
import identity.BookSkuId;
import name.Isbn;

import java.util.Collections;
import java.util.UUID;

public class AdminBookService implements RegisterBookSkuUseCase {
    private final SaveBookSkuPort saveBookSkuPort;

    public AdminBookService(SaveBookSkuPort saveBookSkuPort) {
        this.saveBookSkuPort = saveBookSkuPort;
    }

    @Override
    public void register(BookSkuRegisterCommand bookSkuRegisterCommand) {
        // 1. 도메인 객체 생성
        BookSku bookSku = new BookSku(
                new BookSkuId(UUID.randomUUID().toString()),
                bookSkuRegisterCommand.title(),
                "auth",
                new Isbn(bookSkuRegisterCommand.isbn()),
                Collections.emptyList()

        );

        // 2. 비즈니스 로직 실행
        bookSku.addInventories(bookSkuRegisterCommand.quantity());

        // 3. 결과 저장 요청 (Port 호출)
        saveBookSkuPort.save(bookSku);
    }
}
