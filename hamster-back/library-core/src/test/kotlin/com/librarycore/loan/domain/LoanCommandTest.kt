package com.librarycore.loan.domain

import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

/**
 * 연체 판정은 연체료/제재의 근거라 경계일(due date 당일)과 상태 조건을 정확히 잠가야 한다.
 * 오늘 날짜를 인자로 받는 순수 함수이므로 시계 고정 없이 결정적으로 검증한다.
 */
class LoanCommandTest {

    private val loanDate = LocalDate.of(2026, 1, 1)
    private val dueDate = LocalDate.of(2026, 1, 15)

    private fun loan(status: LoanStatus) = LoanCommand(
        loanId = "loan-1",
        userId = "user-1",
        inventoryId = "inv-1",
        loanDate = loanDate,
        dueDate = dueDate,
        status = status,
    )

    @Test
    @DisplayName("isOverdue(): 반납예정일 다음 날부터 연체다")
    fun isOverdue_StartsDayAfterDueDate() {
        // given
        val command = loan(LoanStatus.LOANED)

        // when & then
        assertTrue(command.isOverdue(dueDate.plusDays(1)))
        assertTrue(command.isOverdue(dueDate.plusYears(1)))
    }

    @Test
    @DisplayName("isOverdue(): 반납예정일 당일은 연체가 아니다 (경계값)")
    fun isOverdue_ExcludesDueDateItself() {
        // given
        val command = loan(LoanStatus.LOANED)

        // when & then — off-by-one 이 생기면 정상 이용자에게 연체료가 붙는다
        assertFalse(command.isOverdue(dueDate))
        assertFalse(command.isOverdue(dueDate.minusDays(1)))
    }

    @Test
    @DisplayName("isOverdue(): 반납 완료 건은 기한이 지나도 연체가 아니다")
    fun isOverdue_IgnoresReturnedLoan() {
        // given
        val command = loan(LoanStatus.RETURNED)

        // when & then
        assertFalse(command.isOverdue(dueDate.plusDays(30)))
    }

    @Test
    @DisplayName("isOverdue(): LOANED 이외 상태는 전부 연체로 잡히지 않는다 — ACTIVE/EXTENDED 누락")
    fun isOverdue_OnlyRecognizesLoanedStatus() {
        // given — status == LOANED 만 검사하므로 대출 중을 뜻하는 다른 상태는 전부 빠진다
        val notDetected = listOf(LoanStatus.ACTIVE, LoanStatus.EXTENDED, LoanStatus.OVERDUE)

        // when & then
        notDetected.forEach { status ->
            assertFalse(
                loan(status).isOverdue(dueDate.plusDays(30)),
                "[$status] 상태는 현재 구현상 연체로 탐지되지 않는다",
            )
        }
    }

    @Test
    @DisplayName("returned(): 상태만 RETURNED 로 바꾸고 나머지 필드는 그대로 복사한다")
    fun returned_ChangesOnlyStatus() {
        // given
        val origin = loan(LoanStatus.LOANED)

        // when
        val result = origin.returned()

        // then
        assertEquals(LoanStatus.RETURNED, result.status)
        assertEquals(origin.copy(status = LoanStatus.RETURNED), result)
    }

    @Test
    @DisplayName("returned(): 원본을 변형하지 않는다 (불변)")
    fun returned_DoesNotMutateSource() {
        // given
        val origin = loan(LoanStatus.LOANED)

        // when
        origin.returned()

        // then
        assertEquals(LoanStatus.LOANED, origin.status)
    }

    @Test
    @DisplayName("returned(): 이미 반납된 건을 다시 반납해도 막지 않는다")
    fun returned_IsNotGuarded() {
        // given
        val alreadyReturned = loan(LoanStatus.RETURNED)

        // when
        val result = alreadyReturned.returned()

        // then — 중복 반납 차단은 유스케이스 책임이라는 사실을 고정한다
        assertEquals(LoanStatus.RETURNED, result.status)
    }
}
