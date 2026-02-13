package com.librarycore.book;

import identity.BookInventoryId;

public record BookInventory(
        BookInventoryId bookInventoryId,
        String bookSkuId,
        BookStatus status
) {

    public BookInventory loaned() {
        return new BookInventory(bookInventoryId, bookSkuId, BookStatus.LOANED);
    }

    public BookInventory available() {
        return new BookInventory(bookInventoryId, bookSkuId, BookStatus.AVAILABLE);
    }
}