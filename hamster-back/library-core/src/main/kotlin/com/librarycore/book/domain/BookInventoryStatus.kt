package com.librarycore.book.domain

enum class BookInventoryStatus {
    AVAILABLE,
    LOANED,
    LOST,
    MAINTENANCE;

    companion object {
        // BookStatus 는 예약까지 포함한 도서 상태, BookInventoryStatus 는 물리 재고 상태라 1:1 이 아니다.
        // 어댑터마다 매핑을 중복 정의하지 않도록 여기 한 곳에 둔다.
        fun from(status: BookStatus?): BookInventoryStatus = when (status) {
            BookStatus.LOANED -> LOANED
            BookStatus.LOST -> LOST
            BookStatus.REPAIRING -> MAINTENANCE
            // 예약은 reservation 테이블이 관리한다. 물리 재고는 그대로 대출 가능 상태.
            BookStatus.RESERVED, BookStatus.AVAILABLE, null -> AVAILABLE
        }
    }
}
