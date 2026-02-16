package com.librarycore.book.domain;

import identity.BookInventoryId;
import identity.BookSkuId;
import name.Isbn;

import java.util.List;

public record BookSku(
        BookSkuId bookSkuId,
        String title,
        String author,
        Isbn isbn,
        List<BookInventory> inventories

) {
    public void addInventories(int quantity) {
        if (quantity <= 0) throw new IllegalArgumentException("수량은 0보다 커야 합니다.");
        for (int i = 0; i < quantity; i++) {
            this.inventories.add(
                    new BookInventory(
                            BookInventoryId.create(),
                            this.bookSkuId,
                            BookStatus.AVAILABLE
                    )
            );
        }
    }
}