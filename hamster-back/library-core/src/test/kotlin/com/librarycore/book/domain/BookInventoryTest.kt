package com.librarycore.book.domain

import identity.BookInventoryId
import identity.BookSkuId
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

class BookInventoryTest {

    private val inventoryId = BookInventoryId.create()
    private val skuId = BookSkuId.create()

    private fun inventory(status: BookStatus?) = BookInventory(inventoryId, skuId, status)

    @Test
    @DisplayName("loaned()/available(): 상태만 바꾸고 식별자는 보존한다")
    fun stateTransition_PreservesIdentifiers() {
        // given
        val origin = inventory(BookStatus.AVAILABLE)

        // when
        val loaned = origin.loaned()
        val returned = loaned.available()

        // then
        assertEquals(BookStatus.LOANED, loaned.status)
        assertEquals(BookStatus.AVAILABLE, returned.status)
        listOf(loaned, returned).forEach {
            assertEquals(inventoryId, it.bookInventoryId, "상태 전이에서 재고 ID 가 바뀌면 안 된다")
            assertEquals(skuId, it.bookSkuId, "상태 전이에서 SKU 참조가 바뀌면 안 된다")
        }
    }

    @Test
    @DisplayName("loaned(): 이미 대출/분실 상태여도 막지 않는다 — 중복 대출 방지는 상위 계층 책임")
    fun stateTransition_HasNoGuard() {
        // given
        val lost = inventory(BookStatus.LOST)

        // when
        val result = lost.loaned()

        // then — 도메인이 전이를 검증하지 않는다는 사실을 고정한다.
        //        대출 유스케이스에 선행 조건 검사가 없으면 분실 도서도 대출된다.
        assertEquals(BookStatus.LOANED, result.status)
    }

    @Test
    @DisplayName("BookInventoryStatus.from(): 도서 상태 → 물리 재고 상태 매핑이 전 케이스 정의돼 있다")
    fun from_MapsEveryBookStatus() {
        // given & when & then
        assertEquals(BookInventoryStatus.LOANED, BookInventoryStatus.from(BookStatus.LOANED))
        assertEquals(BookInventoryStatus.LOST, BookInventoryStatus.from(BookStatus.LOST))
        assertEquals(BookInventoryStatus.MAINTENANCE, BookInventoryStatus.from(BookStatus.REPAIRING))
        assertEquals(BookInventoryStatus.AVAILABLE, BookInventoryStatus.from(BookStatus.AVAILABLE))
    }

    @Test
    @DisplayName("BookInventoryStatus.from(): RESERVED 와 null 은 AVAILABLE 로 떨어진다")
    fun from_TreatsReservedAndNullAsAvailable() {
        // given — 예약은 reservation 테이블이 관리하므로 물리 재고는 대출 가능 상태다.
        //         null 도 같은 칸으로 흡수되므로 "상태 미상"과 "예약중"이 구분되지 않는다.
        // when & then
        assertEquals(BookInventoryStatus.AVAILABLE, BookInventoryStatus.from(BookStatus.RESERVED))
        assertEquals(BookInventoryStatus.AVAILABLE, BookInventoryStatus.from(null))
    }

    @Test
    @DisplayName("BookInventoryStatus.from(): BookStatus 가 추가되면 이 테스트가 깨져야 한다")
    fun from_CoversAllEnumEntries() {
        // given
        val allStatuses = BookStatus.entries

        // when
        val mapped = allStatuses.map { BookInventoryStatus.from(it) }

        // then — when 이 exhaustive 하므로 값이 늘면 컴파일이 깨진다. 개수 고정으로 의도를 명시.
        assertEquals(5, allStatuses.size, "BookStatus 가 변경됐다면 매핑 규칙을 다시 검토하라")
        assertEquals(allStatuses.size, mapped.size)
    }
}
