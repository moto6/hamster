package com.hasterapi.config

import com.hasterapi.book.adaptor.jpa.BookSkuMasterRepository
import com.hasterapi.book.adaptor.persistence.BookPersistenceAdapter
import com.librarycore.book.app.cotract.AdminBookSkuUseCase
import com.librarycore.book.app.cotract.BookOutPort
import com.librarycore.book.app.service.AdminBookService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class BookConfig {
    @Bean
    fun registerBookSkuUseCase(
        bookOutPort: BookOutPort
    ): AdminBookSkuUseCase {
        return AdminBookService(bookOutPort)
    }

    @Bean
    fun registerSaveBookSkuPort(
        bookSkuMasterRepository: BookSkuMasterRepository
    ): BookOutPort {
        return BookPersistenceAdapter(bookSkuMasterRepository)
    }
}