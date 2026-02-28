package com.hasterapi.book.infra.persistence

import com.hasterapi.book.app.jpa.BookSkuMasterRecord
import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface BookSkuMasterRepository : CoroutineCrudRepository<BookSkuMasterRecord, Long>