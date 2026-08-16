package com.hamsterapi.auth.infra.persistance

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

/**
 * 사내 계정 원장 (IDP 독립, 영속 기준점). 기준 식별자 = ldapId.
 * roles 는 CSV(예: "USER,SUPER_ADMIN") 로 저장한다(R2DBC). 변환은 AccountService 에서 수행.
 */
@Table("account")
data class AccountRecord(
    @Id
    val id: Long? = null,

    @Column("ldap_id")
    val ldapId: String,

    val email: String? = null,

    @Column("display_name")
    val displayName: String? = null,

    val department: String? = null,

    /** CSV: USER,SUPER_ADMIN ... */
    val roles: String = "USER",

    val status: String = "ACTIVE",

    @Column("created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column("updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now(),

    @Column("last_login_at")
    val lastLoginAt: LocalDateTime? = null,
)
