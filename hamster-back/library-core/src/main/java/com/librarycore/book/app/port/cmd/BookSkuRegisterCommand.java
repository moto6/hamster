package com.librarycore.book.app.port.cmd;

public record BookSkuRegisterCommand(
        String isbn,
        String title,
        Integer quantity
) {

}
