package com.librarycore.book.app.cotract

import com.librarycore.book.domain.BookSku

interface BookOutPort {
    suspend fun saveSku(bookSku: BookSku)
//    suspend fun findSkuById(id: Long): BookSkuMasterRecord?
//    suspend fun deleteSku(id: Long)
//    suspend fun saveInventory(inventory: BookInventoryDetailRecord)
//    suspend fun countActiveLoansOrReservations(skuId: Long): Long
}
