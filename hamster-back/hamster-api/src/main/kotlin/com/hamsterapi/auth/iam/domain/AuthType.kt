package com.hamsterapi.auth.iam.domain

/** 자격증명 종류. 휴먼 로그인은 ACCESS_TOKEN, 머신/M2M 은 API_KEY(향후 확장). */
enum class AuthType { ACCESS_TOKEN, API_KEY }
