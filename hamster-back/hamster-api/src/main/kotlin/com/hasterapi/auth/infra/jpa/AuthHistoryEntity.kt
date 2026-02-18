package com.hasterapi.auth.infra.jpa

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("auth_history")
data class AuthHistoryEntity(
    @Id
    val pk: Long? = null,
    val authId: String, //jwt id 저장
    val issuer: String,
    val issueDate: LocalDateTime = LocalDateTime.now()
)