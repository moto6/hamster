package com.hamsterapi.auth.idp.domain

/** 지원 IDP 종류. 신규 IDP 는 여기에 값을 추가하고 IdentityProvider 어댑터를 구현한다. */
enum class IdpProvider { SSO, LDAP, GOOGLE, MOCK }
