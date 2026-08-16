package com.hamsterapi.book.infra.persistence.jpa

import org.springframework.data.jpa.repository.JpaRepository

interface BookSkuMasterJpaRepository : JpaRepository<BookSkuMasterEntity, Long>
