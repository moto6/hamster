package com.hamsterapi.auth.infra.persistance

import org.springframework.data.r2dbc.repository.Modifying
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface RefreshTokenRepository : CoroutineCrudRepository<RefreshTokenRecord, Long> {
    suspend fun findByTokenHash(tokenHash: String): RefreshTokenRecord?

    /** 탈취 의심 시 family 전체 폐기 (벌크 업데이트). */
    @Modifying
    @Query("UPDATE refresh_token SET revoked = true WHERE family_id = :familyId")
    suspend fun revokeFamily(familyId: String): Int
}
