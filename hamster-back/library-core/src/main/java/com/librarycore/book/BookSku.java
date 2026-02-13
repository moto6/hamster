package com.librarycore.book;

import identity.BookSkuId;
import name.Isbn;

public record BookSku(
        BookSkuId bookSkuId,
        String title,
        String author,
        Isbn isbn
) {}