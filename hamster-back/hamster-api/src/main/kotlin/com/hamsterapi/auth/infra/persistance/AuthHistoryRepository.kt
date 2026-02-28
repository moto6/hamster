package com.hamsterapi.auth.infra.persistance

import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface AuthHistoryRepository : CoroutineCrudRepository<AuthHistoryRecord, Long>
