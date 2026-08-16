package com.hamsterapi.auth.iam.domain

/** 계정 상태. DISABLED 계정은 로그인/토큰 발급이 거부된다. */
enum class AccountStatus { ACTIVE, DISABLED }
