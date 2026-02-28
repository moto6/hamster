package com.hamsterapi.book.infra.persistence

import com.hamsterapi.book.app.jpa.BookSkuMasterRecord
import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface BookSkuMasterRepository : CoroutineCrudRepository<BookSkuMasterRecord, Long>