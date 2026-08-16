package com.hamsterapi.book.infra.persistence.r2dbc

import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface BookSkuMasterRepository : CoroutineCrudRepository<BookSkuMasterRecord, Long>