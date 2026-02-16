package com.hasterapi.config

import com.hasterapi.adaptor.jpa.JpaBookSkuRepository
import com.hasterapi.adaptor.persistence.BookPersistenceAdapter
import com.librarycore.book.app.port.RegisterBookSkuUseCase
import com.librarycore.book.app.port.SaveBookSkuPort
import com.librarycore.book.app.service.AdminBookService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class BookConfig {
    @Bean
    fun registerBookSkuUseCase(
        saveBookSkuPort: SaveBookSkuPort
    ): RegisterBookSkuUseCase {
        return AdminBookService(saveBookSkuPort)
    }

    @Bean
    fun registerSaveBookSkuPort(
    ): SaveBookSkuPort {
        return BookPersistenceAdapter(JpaBookSkuRepository())
    }
}