package com.librarycore.book.app.service

import com.librarycore.book.app.cotract.BookOutPort
import com.librarycore.book.app.cotract.payload.BookSkuRegisterCommand
import com.librarycore.book.app.cotract.payload.BookSkuSearchQuery
import com.librarycore.book.domain.BookSku
import com.librarycore.book.domain.BookStatus
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

/**
 * 등록 유스케이스. 어댑터(BookOutPort)를 스파이로 대체해 "무엇을 저장했는가"까지 확인한다.
 * 저장 호출 여부만 보는 테스트는 잘못된 데이터를 저장하는 버그를 놓친다.
 */
class AdminBookServiceTest {

    private class SpyBookOutPort : BookOutPort {
        var saved: BookSku? = null
        var saveCount = 0

        override suspend fun saveSku(bookSku: BookSku) {
            saved = bookSku
            saveCount++
        }
    }

    private fun command(quantity: Int) = BookSkuRegisterCommand(
        isbn = "9788936433598",
        title = "채식주의자",
        author = "한강",
        publisherName = "창비",
        quantity = quantity,
    )

    @Test
    @DisplayName("register(): 수량만큼 재고를 만든 SKU 를 저장하고 결과로 되돌려준다")
    fun register_PersistsSkuWithInventories() = runTest {
        // given
        val outPort = SpyBookOutPort()
        val service = AdminBookService(outPort)

        // when
        val result = service.register(command(quantity = 3))

        // then
        val saved = assertNotNull(outPort.saved, "SKU 가 저장되지 않았다")
        assertEquals(1, outPort.saveCount)
        assertEquals(3, saved.inventories.size)
        assertTrue(saved.inventories.all { it.status == BookStatus.AVAILABLE })
        assertEquals(saved.bookSkuId, result.bookSkuId)
        assertEquals("채식주의자", result.title)
        assertEquals("9788936433598", result.isbn.name)
    }

    @Test
    @DisplayName("register(): 요청의 저자명이 그대로 저장돼야 한다")
    fun register_KeepsRequestedAuthor() = runTest {
        // given
        val outPort = SpyBookOutPort()
        val service = AdminBookService(outPort)

        // when
        val result = service.register(command(quantity = 1))

        // then — 현재 구현은 저자명을 리터럴 "auth" 로 하드코딩해 이 검증에서 실패한다.
        assertEquals("한강", outPort.saved?.author)
        assertEquals("한강", result.author)
    }

    @Test
    @DisplayName("register(): 수량이 0 이면 저장 없이 실패한다 (재고 없는 유령 SKU 방지)")
    fun register_RejectsZeroQuantityBeforePersisting() = runTest {
        // given
        val outPort = SpyBookOutPort()
        val service = AdminBookService(outPort)

        // when
        assertFailsWith<IllegalArgumentException> { service.register(command(quantity = 0)) }

        // then
        assertNull(outPort.saved, "검증 실패인데 저장이 일어났다")
        assertEquals(0, outPort.saveCount)
    }

    @Test
    @DisplayName("register(): 같은 ISBN 을 두 번 등록해도 막지 않고 서로 다른 SKU 가 생긴다")
    fun register_DoesNotDeduplicateIsbn() = runTest {
        // given
        val outPort = SpyBookOutPort()
        val service = AdminBookService(outPort)

        // when
        val first = service.register(command(quantity = 1))
        val second = service.register(command(quantity = 1))

        // then — 중복 등록 방지가 없다는 사실을 고정한다(DB unique 제약이나 선행 조회가 필요).
        assertEquals(2, outPort.saveCount)
        assertEquals(first.isbn, second.isbn)
        assertTrue(first.bookSkuId != second.bookSkuId)
    }

    @Test
    @DisplayName("listSkus(): 검색 조건과 무관하게 고정 더미 5건을 반환한다")
    fun listSkus_ReturnsHardcodedDemoData() = runTest {
        // given
        val service = AdminBookService(SpyBookOutPort())

        // when
        val page = service.listSkus(BookSkuSearchQuery(foo = "존재하지-않는-검색어"))

        // then — 아직 조회 어댑터가 붙지 않은 스텁이라는 사실을 고정한다.
        assertEquals(5, page.resultsCount)
        assertEquals(AdminBookService.bookList, page.content)
    }
}
