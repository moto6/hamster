package com.hamsterapi.auth.infra.persistance

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

/**
 * 리프레시 토큰. 불투명 랜덤값의 SHA-256 해시만 저장한다(평문 미저장).
 * 회전(rotation): refresh 시 기존 토큰을 폐기하고 새 토큰을 같은 family 로 발급.
 * 재사용 탐지: 이미 revoked 된 토큰이 다시 들어오면 family 전체를 폐기(탈취 의심).
 */
@Table("refresh_token")
data class RefreshTokenRecord(
    @Id
    val id: Long? = null,

    @Column("account_id")
    val accountId: Long,

    /** SHA-256 hex */
    @Column("token_hash")
    val tokenHash: String,

    /** 회전 체인 식별 (재사용 탐지 시 family 전체 폐기) */
    @Column("family_id")
    val familyId: String,

    @Column("expires_at")
    val expiresAt: LocalDateTime,

    val revoked: Boolean = false,

    @Column("created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
)
