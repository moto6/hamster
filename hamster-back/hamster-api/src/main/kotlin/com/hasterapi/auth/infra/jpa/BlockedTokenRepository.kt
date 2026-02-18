package com.hasterapi.auth.infra.jpa

import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface BlockedTokenRepository : CoroutineCrudRepository<BlockedTokenEntity, String> {
}