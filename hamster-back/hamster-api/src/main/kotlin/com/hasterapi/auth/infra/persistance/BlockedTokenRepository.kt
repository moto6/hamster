package com.hasterapi.auth.infra.persistance

import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface BlockedTokenRepository : CoroutineCrudRepository<BlockedTokenEntity, String> {
}