package com.hasterapi.config

import com.hasterapi.book.adaptor.jpa.BookReservationRepository
import com.hasterapi.book.adaptor.jpa.BookSkuMasterRepository
import com.hasterapi.book.adaptor.persistence.BookPersistenceAdapter
import com.hasterapi.book.adaptor.persistence.BookReservationPersistAdaptor
import com.hasterapi.loan.adaptor.LoanPersistenceAdaptor
import com.librarycore.book.app.cotract.AdminBookSkuUseCase
import com.librarycore.book.app.cotract.AdminReservationUseCase
import com.librarycore.book.app.cotract.BookOutPort
import com.librarycore.book.app.cotract.ReservationOutPort
import com.librarycore.book.app.cotract.ReservationUseCase
import com.librarycore.book.app.cotract.SearchBookUseCase
import com.librarycore.book.app.service.AdminBookService
import com.librarycore.book.app.service.AdminReservationService
import com.librarycore.book.app.service.ReservationService
import com.librarycore.book.app.service.SearchBookService
import com.librarycore.loan.app.contract.AdminLoanUseCase
import com.librarycore.loan.app.contract.LoanPersistenceOutPort
import com.librarycore.loan.app.contract.LoanUseCase
import com.librarycore.loan.app.service.AdminLoanService
import com.librarycore.loan.app.service.LoanService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class ApplicationBeanConfig {
    @Bean
    fun registerBookSkuUseCase(
        bookOutPort: BookOutPort
    ): AdminBookSkuUseCase {
        return AdminBookService(bookOutPort)
    }

    @Bean
    fun registerBookOutPort(
        bookSkuMasterRepository: BookSkuMasterRepository
    ): BookOutPort {
        return BookPersistenceAdapter(bookSkuMasterRepository)
    }

    @Bean
    fun registerAdminReservationUseCase(
        reservationOutPort: ReservationOutPort,
    ): AdminReservationUseCase {
        return AdminReservationService(reservationOutPort)
    }

    @Bean
    fun registerReservationOutPort(
        bookReservationRepository: BookReservationRepository
    ): ReservationOutPort {
        return BookReservationPersistAdaptor(bookReservationRepository)
    }


    // === 아래로는 mock
    @Bean
    fun registerSearchBookUseCase(
    ): SearchBookUseCase {
        return SearchBookService()
    }

    @Bean
    fun registerReservationUseCase(
    ): ReservationUseCase {
        return ReservationService()
    }

    @Bean
    fun registerAdminLoanUseCase(
        loanPersistenceOutPort: LoanPersistenceOutPort
    ): AdminLoanUseCase {
        return AdminLoanService(loanPersistenceOutPort)
    }

    @Bean
    fun registerLoanPersistenceOutPort(
    ): LoanPersistenceOutPort {
        return LoanPersistenceAdaptor()
    }

    @Bean
    fun registerLoanUseCase(
    ): LoanUseCase {
        return LoanService()
    }

}
/*

 @Bean
    fun register(
    ):  {
        return
    }

 */