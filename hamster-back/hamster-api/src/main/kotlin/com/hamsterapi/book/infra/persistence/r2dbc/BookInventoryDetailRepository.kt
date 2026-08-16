package com.hamsterapi.book.infra.persistence.r2dbc

import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface BookInventoryDetailRepository : CoroutineCrudRepository<BookInventoryDetailRecord, Long>
