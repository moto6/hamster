package com.hasterapi.book.adaptor.jpa

import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface BookSkuMasterRepository : CoroutineCrudRepository<BookSkuMasterRecord, Long>