package com.hamsterapi.auth.idp

import org.springframework.boot.context.properties.ConfigurationProperties

/** application.yml 의 `auth.*` 바인딩. 시크릿류는 환경변수로 주입(레포 커밋 금지). */
@ConfigurationProperties(prefix = "auth")
data class AuthProperties(
    /** sso | mock */
    val idp: String = "mock",
    val frontendBaseUrl: String = "http://localhost:5173",
    /**
     * 최초 로그인(JIT) 시 SUPER_ADMIN 으로 부트스트랩할 LDAP 목록 (초기 운영자 시딩용).
     * admin.demo 는 개발용 Mock IDP 전용 계정이라 운영(sso)에서는 생성될 수 없어 안전하다.
     */
    val bootstrapSuperAdmins: List<String> = listOf("admin.demo"),
    val jwt: Jwt = Jwt(),
    val cookie: Cookie = Cookie(),
    val sso: Sso = Sso(),
) {
    data class Jwt(
        val issuer: String = "hamster",
        val secret: String = "dev-only-insecure-secret-please-override-min-32-bytes!!",
        val accessTtlSeconds: Long = 1800,       // 30m
        val refreshTtlSeconds: Long = 1209600,   // 14d
    )

    data class Cookie(
        val secure: Boolean = false,
        val sameSite: String = "Lax",
    )

    /**
     * 외부 SSO(OIDC) 설정. 회사 IDP(OIDC 호환)에 맞춰 issuer/엔드포인트/클라이언트 값을 주입한다.
     * 기본값은 자리표시자이므로 운영에서는 반드시 환경변수로 실제 값을 넣을 것.
     */
    data class Sso(
        val issuer: String = "https://sso.example.com",
        val authorizeUri: String = "https://sso.example.com/oauth/authorize",
        val tokenUri: String = "https://sso.example.com/oauth/token",
        val userinfoUri: String = "https://sso.example.com/user/me",
        val logoutUri: String = "https://sso.example.com/logout",
        val clientId: String = "",
        val clientSecret: String = "",
        val redirectUri: String = "http://localhost:5173/api/v0/auth/callback",
        val scope: String = "openid email profile",
    )
}
