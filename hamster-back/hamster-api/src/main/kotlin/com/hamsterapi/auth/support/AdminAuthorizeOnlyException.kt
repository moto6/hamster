package com.hamsterapi.auth.support

/** RBAC 인가 실패(→ 403). */
class AdminAuthorizeOnlyException(message: String) : RuntimeException(message)
