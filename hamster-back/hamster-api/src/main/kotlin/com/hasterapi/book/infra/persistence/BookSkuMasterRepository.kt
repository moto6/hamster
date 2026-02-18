package com.hasterapi.book.app.jpa

import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface BookSkuMasterRepository : CoroutineCrudRepository<BookSkuMasterRecord, Long>