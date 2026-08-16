package com.hamsterapi.book.infra.persistence.jpa

import com.librarycore.book.domain.BookInventoryStatus
import com.librarycore.book.domain.BookSku
import jakarta.persistence.CascadeType
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.time.LocalDateTime

/**
 * book_sku_master 의 JPA 매핑. R2DBC 쪽 대응물은
 * [com.hamsterapi.book.infra.persistence.r2dbc.BookSkuMasterRecord] 다.
 *
 * data class 를 쓰지 않는다 — 지연로딩 컬렉션이 equals/hashCode/toString 에 끌려들어가
 * 의도치 않은 초기화와 LazyInitializationException 을 유발한다.
 */
@Entity
@Table(name = "book_sku_master")
class BookSkuMasterEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,
    var isbn: String,
    var title: String,
    var author: String,
    var publisher: String? = null,
    var publishYear: Int? = null,
    var callNumber: String? = null,
    var category: String? = null,
    var description: String? = null,
    var coverImageUrl: String? = null,
    var totalCopies: Int = 0,
    var availableCopies: Int = 0,
    var createdAt: LocalDateTime = LocalDateTime.now(),
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    // R2DBC 에는 없는 기능. 부모만 save 해도 자식 insert 와 FK 세팅이 함께 나간다.
    @OneToMany(mappedBy = "bookSku", cascade = [CascadeType.ALL], orphanRemoval = true)
    var inventories: MutableList<BookInventoryDetailEntity> = mutableListOf(),
) {
    fun addInventory(status: BookInventoryStatus) {
        inventories.add(BookInventoryDetailEntity(bookSku = this, status = status))
    }

    companion object {
        fun from(bookSku: BookSku): BookSkuMasterEntity {
            val entity = BookSkuMasterEntity(
                isbn = bookSku.isbn.name,
                title = bookSku.title,
                author = bookSku.author,
                totalCopies = bookSku.inventories.size,
            )
            bookSku.inventories.forEach { entity.addInventory(BookInventoryStatus.from(it.status)) }
            return entity
        }
    }
}
