package com.librarycore.book.domain

import identity.BookSkuId
import name.Isbn
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue

/**
 * 재고 생성은 "도서 1종 등록 = 물리 장서 N권 생성" 이라는 유일한 도메인 규칙이다.
 * 수량 검증이 뚫리면 유령 재고가 생기므로 경계값을 강하게 잠근다.
 */
class BookSkuTest {

    private fun newSku() = BookSku(
        bookSkuId = BookSkuId.create(),
        title = "채식주의자",
        author = "한강",
        isbn = Isbn("9788936433598"),
        inventories = mutableListOf(),
    )

    @Test
    @DisplayName("addInventories(): 요청 수량만큼 AVAILABLE 재고가 생성된다")
    fun addInventories_CreatesRequestedQuantity() {
        // given
        val sku = newSku()

        // when
        sku.addInventories(3)

        // then
        assertEquals(3, sku.inventories.size)
        assertTrue(sku.inventories.all { it.status == BookStatus.AVAILABLE }, "신규 재고는 전부 AVAILABLE 이어야 한다")
    }

    @Test
    @DisplayName("addInventories(): 생성된 재고는 모두 자기 SKU 를 가리키고 재고 ID 는 서로 다르다")
    fun addInventories_BindsSkuAndUniqueIds() {
        // given
        val sku = newSku()

        // when
        sku.addInventories(50)

        // then
        assertTrue(sku.inventories.all { it.bookSkuId == sku.bookSkuId }, "재고가 다른 SKU 를 가리키면 안 된다")
        assertEquals(50, sku.inventories.mapNotNull { it.bookInventoryId }.distinct().size, "재고 ID 가 중복됐다")
    }

    @Test
    @DisplayName("addInventories(): 수량 0 은 거부되고 재고가 하나도 생기지 않는다")
    fun addInventories_RejectsZero() {
        // given
        val sku = newSku()

        // when
        val error = assertFailsWith<IllegalArgumentException> { sku.addInventories(0) }

        // then — 예외만 던지고 끝나는 게 아니라 부분 생성도 없어야 한다
        assertEquals("수량은 0보다 커야 합니다.", error.message)
        assertTrue(sku.inventories.isEmpty())
    }

    @Test
    @DisplayName("addInventories(): 음수 수량은 거부된다")
    fun addInventories_RejectsNegative() {
        // given
        val sku = newSku()

        // when & then
        assertFailsWith<IllegalArgumentException> { sku.addInventories(-1) }
        assertFailsWith<IllegalArgumentException> { sku.addInventories(Int.MIN_VALUE) }
        assertTrue(sku.inventories.isEmpty())
    }

    @Test
    @DisplayName("addInventories(): 재호출하면 덮어쓰지 않고 누적된다")
    fun addInventories_AppendsInsteadOfReplacing() {
        // given
        val sku = newSku()
        sku.addInventories(2)

        // when
        sku.addInventories(3)

        // then — 입고(재입고) 시맨틱. 이걸 "설정"으로 오해하면 재고가 두 배가 된다.
        assertEquals(5, sku.inventories.size)
    }
}
