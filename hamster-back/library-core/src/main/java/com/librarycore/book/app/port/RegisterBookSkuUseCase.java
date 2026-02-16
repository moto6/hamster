package com.librarycore.book.app.port;

import com.librarycore.book.app.port.cmd.BookSkuRegisterCommand;

public interface RegisterBookSkuUseCase {
    void register(BookSkuRegisterCommand bookSkuRegisterCommand);
}
