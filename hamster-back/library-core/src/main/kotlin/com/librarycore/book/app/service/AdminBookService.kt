package com.librarycore.book.app.service

import collections.CursorPage
import com.librarycore.book.app.cotract.AdminBookSkuUseCase
import com.librarycore.book.app.cotract.BookOutPort
import com.librarycore.book.app.cotract.payload.BookSkuRegisterCommand
import com.librarycore.book.app.cotract.payload.BookSkuRegisterResult
import com.librarycore.book.app.cotract.payload.BookSkuResult
import com.librarycore.book.app.cotract.payload.BookSkuSearchQuery
import com.librarycore.book.app.cotract.payload.BookUpdateCommand
import com.librarycore.book.domain.BookSku
import identity.BookSkuId
import name.Isbn
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.UUID

class AdminBookService(
    private val bookOutPort: BookOutPort,
) : AdminBookSkuUseCase {
    override suspend fun register(bookSkuRegisterCommand: BookSkuRegisterCommand): BookSkuRegisterResult {
        val bookSku = BookSku(
            BookSkuId(UUID.randomUUID().toString()),
            bookSkuRegisterCommand.title,
            "auth",
            Isbn(bookSkuRegisterCommand.isbn),
            ArrayList()
        )
        bookSku.addInventories(bookSkuRegisterCommand.quantity)
        bookOutPort.saveSku(bookSku)
        return BookSkuRegisterResult.fromModel(bookSku)
    }

    override suspend fun update(
        id: Long,
        command: BookUpdateCommand
    ): BookSkuResult {
        TODO("Not yet implemented")
    }

    override suspend fun delete(id: Long) {
        TODO("Not yet implemented")
    }

    override suspend fun listSkus(query: BookSkuSearchQuery): CursorPage<BookSkuResult> {
        return CursorPage.of(bookList)
    }

    companion object {
        val bookList = listOf(
            BookSkuResult(
                id = 1L,
                isbn = "9788936433598",
                title = "채식주의자",
                author = "한강",
                publisher = "창비",
                publishYear = 2007,
                callNumber = "813.7-한12ㅊ",
                category = "문학",
                description = "한국 현대문학의 걸작. 맨부커상 수상작.",
                coverImageUrl = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300",
                totalCopies = 5,
                availableCopies = 3,
                reservationCount = 1,
                expectedReturnDate = LocalDate.parse("2024-02-20T23:59:59Z", DateTimeFormatter.ISO_DATE_TIME)
            ),
            BookSkuResult(
                id = 2L,
                isbn = "9788934942467",
                title = "82년생 김지영",
                author = "조남주",
                publisher = "민음사",
                publishYear = 2016,
                callNumber = "813.7-조211ㅍ",
                category = "문학",
                description = "평범한 여성 김지영의 이야기를 통해 한국 사회의 성차별 문제를 다룬 소설.",
                coverImageUrl = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300",
                totalCopies = 8,
                availableCopies = 2,
                reservationCount = 2,
                expectedReturnDate = LocalDate.parse("2024-02-19T23:59:59Z", DateTimeFormatter.ISO_DATE_TIME)
            ),
            BookSkuResult(
                id = 3L,
                isbn = "9788932917245",
                title = "코스모스",
                author = "칼 세이건",
                publisher = "사이언스북스",
                publishYear = 2006,
                callNumber = "443.1-세68ㅋ",
                category = "자연과학",
                description = "우주와 인류 문명에 대한 과학적 통찰.",
                coverImageUrl = "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=300",
                totalCopies = 4,
                availableCopies = 4,
                reservationCount = 0,
                expectedReturnDate = LocalDate.now() // JSON에 날짜가 없어서 임의 지정
            ),
            BookSkuResult(
                id = 4L,
                isbn = "9788932473901",
                title = "사피엔스",
                author = "유발 하라리",
                publisher = "김영사",
                publishYear = 2015,
                callNumber = "909-하231ㅅ",
                category = "역사",
                description = "인류의 역사와 미래에 대한 통찰력 있는 서사.",
                coverImageUrl = "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=300",
                totalCopies = 6,
                availableCopies = 0,
                reservationCount = 2,
                expectedReturnDate = LocalDate.parse("2024-02-20T23:59:59Z", DateTimeFormatter.ISO_DATE_TIME)
            ),
            BookSkuResult(
                id = 5L,
                isbn = "9788970127248",
                title = "트렌드 코리아 2025",
                author = "김난도 외",
                publisher = "미래의창",
                publishYear = 2024,
                callNumber = "321.97-김211ㅌ-2025",
                category = "사회과학",
                description = "2025년 대한민국 소비 트렌드 전망.",
                coverImageUrl = "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300",
                totalCopies = 3,
                availableCopies = 0,
                reservationCount = 1,
                expectedReturnDate = LocalDate.parse("2024-02-22")
            )
        )
    }
}
