package com.librarycore.book.domain;

import identity.BookInventoryId;
import identity.BookSkuId;

public record BookInventory(
        BookInventoryId bookInventoryId,
        BookSkuId bookSkuId,
        BookStatus status
) {

    public BookInventory loaned() {
        return new BookInventory(bookInventoryId, bookSkuId, BookStatus.LOANED);
    }

    public BookInventory available() {
        return new BookInventory(bookInventoryId, bookSkuId, BookStatus.AVAILABLE);
    }
}