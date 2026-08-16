package com.hamsterapi.auth.app.payload

import com.hamsterapi.auth.idp.domain.IdpProvider

/** 외부 IDP 가 확인해 준 신원 (code 교환 결과). 도메인에 저장하지 않는다. */
data class ExternalIdentity(
    val provider: IdpProvider,
    val subject: String,
    val ldapId: String,
    val email: String?,
    val displayName: String?,
    val department: String? = null,
)
