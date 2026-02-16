package com.librarycore.book.app.port;

import com.librarycore.book.domain.BookSku;

public interface SaveBookSkuPort {
    void save(BookSku bookSku);
}
