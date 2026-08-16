package com.hamsterapi.auth.infra.persistance

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

/** "이 IDP의 이 subject = 이 Account" 연결고리. IDP 교체/다중 IDP를 흡수한다. */
@Table("identity_link")
data class IdentityLinkRecord(
    @Id
    val id: Long? = null,

    @Column("account_id")
    val accountId: Long,

    /** SSO | LDAP | GOOGLE | MOCK */
    val provider: String,

    val subject: String,

    @Column("created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
)
