package com.hasterapi.auth.infra.jpa

import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface R2dbcAuthHistoryRepository : CoroutineCrudRepository<AuthHistoryEntity, Long>
