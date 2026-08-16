package collections

import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse

class CursorPageTest {

    @Test
    @DisplayName("of(): 항목 수가 resultsCount 에 그대로 반영된다")
    fun of_ReflectsItemCount() {
        // given
        val items = listOf("a", "b", "c")

        // when
        val page = CursorPage.of(items)

        // then
        assertEquals(items, page.content)
        assertEquals(3, page.resultsCount)
    }

    @Test
    @DisplayName("of(): 빈 리스트도 예외 없이 빈 페이지가 된다")
    fun of_AcceptsEmptyList() {
        // given
        val items = emptyList<String>()

        // when
        val page = CursorPage.of(items)

        // then
        assertEquals(0, page.resultsCount)
        assertFalse(page.hasNext)
    }

    @Test
    @DisplayName("of(): 커서/hasNext 를 계산하지 않는다 — 페이지네이션 미구현 상태를 고정한다")
    fun of_DoesNotComputeCursor() {
        // given — 항목이 아무리 많아도 of() 는 커서를 모른다
        val items = (1..1000).toList()

        // when
        val page = CursorPage.of(items)

        // then — 0/false 고정. 실제 페이지네이션을 붙이면 이 테스트가 깨져야 정상이다.
        assertEquals(0L, page.currentCursor)
        assertFalse(page.hasNext, "of() 는 다음 페이지 존재 여부를 판단하지 못한다")
    }
}
