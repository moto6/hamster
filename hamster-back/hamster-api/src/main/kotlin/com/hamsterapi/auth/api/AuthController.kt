package com.hamsterapi.auth.api

import com.hamsterapi.auth.api.dto.LogoutResponse
import com.hamsterapi.auth.api.dto.TokenResponse
import com.hamsterapi.auth.api.dto.UserResponse
import com.hamsterapi.auth.app.AuthPrincipal
import com.hamsterapi.auth.app.payload.AuthInfo
import com.hamsterapi.auth.iam.exception.InvalidAuthStateException
import com.hamsterapi.auth.iam.exception.InvalidRefreshTokenException
import com.hamsterapi.auth.iam.service.AccountService
import com.hamsterapi.auth.iam.service.JwtService
import com.hamsterapi.auth.iam.service.RefreshTokenService
import com.hamsterapi.auth.idp.AuthProperties
import com.hamsterapi.auth.idp.domain.IdpProvider
import com.hamsterapi.auth.idp.infra.IdentityProvider
import org.slf4j.LoggerFactory
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CookieValue
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.util.UriComponentsBuilder
import java.net.URI
import java.util.UUID

/**
 * 인증 엔드포인트 (WebFlux/reactive).
 *  - 흐름: SPA → /login(302→IDP) → IDP → /callback(토큰발급+refresh쿠키, 302→프론트)
 *          → 프론트가 /refresh 로 access token 부트스트랩 → 업무 API 는 Authorization: Bearer.
 *  - refresh 는 본문에 노출하지 않고 HttpOnly 쿠키로만 오간다(XSS 시 탈취 방지).
 *  - 경로 화이트리스트는 없다. /login·/callback·/refresh·/logout 은 @AuthPrincipal 을 받지 않아 자연히 공개이고,
 *    /me 는 @AuthPrincipal 을 받으므로 AuthInfo 부재 시 리졸버가 401 을 던진다.
 */
@RestController
@RequestMapping("/api/v0/auth")
class AuthController(
    private val props: AuthProperties,
    private val identityProvider: IdentityProvider,
    private val accountService: AccountService,
    private val jwtService: JwtService,
    private val refreshTokenService: RefreshTokenService,
) {
    private val log = LoggerFactory.getLogger(AuthController::class.java)

    /** 로그인 시작 → IDP authorize 로 302. state(CSRF)·복귀경로를 단기 쿠키로 보관. */
    @GetMapping("/login")
    fun login(
        @RequestParam(required = false) redirect: String?,
        // 개발용: Mock IDP 에서 어떤 데모 계정으로 로그인할지("admin"|"user"). 운영 IDP 는 무시.
        @RequestParam(required = false) demo: String?,
    ): ResponseEntity<Void> {
        val state = UUID.randomUUID().toString()
        val headers = HttpHeaders().apply {
            add(HttpHeaders.SET_COOKIE, shortCookie(STATE_COOKIE, state).toString())
            add(HttpHeaders.SET_COOKIE, shortCookie(REDIRECT_COOKIE, sanitizeRedirect(redirect)).toString())
            location = URI.create(identityProvider.authorizeUrl(state, demo))
        }
        return ResponseEntity(headers, HttpStatus.FOUND)
    }

    /** IDP 콜백 → code 교환 → JIT 프로비저닝 → access/refresh 발급 → 프론트 콜백 페이지로 302. */
    @GetMapping("/callback")
    suspend fun callback(
        @RequestParam code: String,
        @RequestParam(required = false) state: String?,
        @CookieValue(name = STATE_COOKIE, required = false) stateCookie: String?,
        @CookieValue(name = REDIRECT_COOKIE, required = false) redirectCookie: String?,
    ): ResponseEntity<Void> {
        // CSRF: state 일치 검증 (Mock IDP 는 자가 루프이므로 관대)
        if (identityProvider.provider != IdpProvider.MOCK && (state.isNullOrBlank() || state != stateCookie)) {
            log.warn("callback state mismatch: param={}, cookie={}", state, stateCookie)
            throw InvalidAuthStateException()
        }

        val account = accountService.provision(identityProvider.exchange(code))
        val refresh = refreshTokenService.issue(account.id!!)

        val target = UriComponentsBuilder.fromUriString("${props.frontendBaseUrl}/auth/callback")
            .queryParam("redirect", sanitizeRedirect(redirectCookie))
            .build().encode().toUriString()

        val headers = HttpHeaders().apply {
            add(HttpHeaders.SET_COOKIE, refreshCookie(refresh).toString())
            add(HttpHeaders.SET_COOKIE, expireCookie(STATE_COOKIE).toString())
            add(HttpHeaders.SET_COOKIE, expireCookie(REDIRECT_COOKIE).toString())
            location = URI.create(target)
        }
        log.info("login success: ldap={} via {}", account.ldapId, identityProvider.provider)
        return ResponseEntity(headers, HttpStatus.FOUND)
    }

    /** refresh 쿠키 → 회전 → 새 access(본문)+refresh(쿠키). 프론트 부트스트랩/만료 재발급 공용. */
    @PostMapping("/refresh")
    suspend fun refresh(
        @CookieValue(name = REFRESH_COOKIE, required = false) refreshCookie: String?,
    ): ResponseEntity<TokenResponse> {
        val raw = refreshCookie ?: throw InvalidRefreshTokenException("리프레시 토큰이 없습니다.")
        val (accountId, newRefresh) = refreshTokenService.rotate(raw)
        val account = accountService.loadById(accountId)
        val access = jwtService.issueAccessToken(account)
        val headers = HttpHeaders().apply { add(HttpHeaders.SET_COOKIE, refreshCookie(newRefresh).toString()) }
        return ResponseEntity.ok().headers(headers)
            .body(TokenResponse(access, "Bearer", props.jwt.accessTtlSeconds, UserResponse.from(account)))
    }

    /** 로그아웃 → refresh 폐기 + 쿠키 삭제. (선택) IDP 로그아웃 URL 반환. */
    @PostMapping("/logout")
    suspend fun logout(
        @CookieValue(name = REFRESH_COOKIE, required = false) refreshCookie: String?,
    ): ResponseEntity<LogoutResponse> {
        refreshCookie?.let { refreshTokenService.revoke(it) }
        val headers = HttpHeaders().apply { add(HttpHeaders.SET_COOKIE, expireCookie(REFRESH_COOKIE).toString()) }
        return ResponseEntity.ok().headers(headers)
            .body(LogoutResponse(identityProvider.logoutUrl(props.frontendBaseUrl)))
    }

    /** 현재 로그인 사용자. JwtAuthWebFilter 보호 경로. */
    @GetMapping("/me")
    fun me(@AuthPrincipal me: AuthInfo): UserResponse = UserResponse.from(me)

    // ── 쿠키 헬퍼 ────────────────────────────────────────────────────────────
    private fun refreshCookie(value: String) = baseCookie(REFRESH_COOKIE, value, props.jwt.refreshTtlSeconds)
    private fun shortCookie(name: String, value: String) = baseCookie(name, value, 300)
    private fun expireCookie(name: String) = baseCookie(name, "", 0)

    private fun baseCookie(name: String, value: String, maxAge: Long): ResponseCookie =
        ResponseCookie.from(name, value)
            .httpOnly(true)
            .secure(props.cookie.secure)
            .sameSite(props.cookie.sameSite)
            .path(AUTH_COOKIE_PATH)
            .maxAge(maxAge)
            .build()

    /** 오픈 리다이렉트 방지: 앱 내부 경로(/...)만 허용. */
    private fun sanitizeRedirect(redirect: String?): String =
        if (redirect != null && redirect.startsWith("/") && !redirect.startsWith("//")) redirect else "/"

    companion object {
        private const val REFRESH_COOKIE = "refresh_token"
        private const val STATE_COOKIE = "auth_state"
        private const val REDIRECT_COOKIE = "auth_redirect"
        private const val AUTH_COOKIE_PATH = "/api/v0/auth"
    }
}
