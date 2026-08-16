package com.hamsterapi.auth.idp.infra.impl

import com.hamsterapi.auth.app.payload.ExternalIdentity
import com.hamsterapi.auth.idp.AuthProperties
import com.hamsterapi.auth.idp.domain.IdpProvider
import com.hamsterapi.auth.idp.infra.IdentityProvider
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitBody
import org.springframework.web.util.UriComponentsBuilder
import tools.jackson.core.type.TypeReference
import tools.jackson.databind.ObjectMapper
import java.util.Base64

/**
 * 외부 SSO(OIDC) 어댑터 — OAuth2 Authorization Code + OIDC. (WebFlux WebClient 로 논블로킹 교환)
 * code→token 교환은 서버사이드(client_secret 은 HTTP Basic 헤더). id_token(OIDC) 클레임으로 신원 식별.
 *
 * 참고: 일부 SSO 는 리프레시 토큰을 발급하지 않으므로(보안정책) 우리 백엔드가 자체 access/refresh 를 발급한다.
 * id_token 은 TLS 채널로 token 엔드포인트에서 직접 수신하므로 신뢰하나, 운영 강화 시 JWKS 서명검증을 추가할 것
 * (jwks: <issuer>/oauth2/jwks). 여기서는 페이로드 클레임만 파싱한다.
 *
 * 회사 IDP 의 클레임 키가 다르면 exchange() 의 ldapId/email/displayName 매핑만 조정하면 된다.
 */
class SsoIdentityProvider(
    private val props: AuthProperties,
    private val webClient: WebClient,
    private val objectMapper: ObjectMapper,
) : IdentityProvider {

    override val provider = IdpProvider.SSO

    override fun authorizeUrl(state: String, loginHint: String?): String {
        val s = props.sso
        return UriComponentsBuilder.fromUriString(s.authorizeUri)
            .queryParam("response_type", "code")
            .queryParam("client_id", s.clientId)
            .queryParam("redirect_uri", s.redirectUri)
            .queryParam("scope", s.scope)
            .queryParam("state", state)
            .build().encode().toUriString()
    }

    override suspend fun exchange(code: String): ExternalIdentity {
        val s = props.sso
        val basic = Base64.getEncoder()
            .encodeToString("${s.clientId}:${s.clientSecret}".toByteArray())

        val tokenResponse: Map<String, Any> = webClient.post()
            .uri(s.tokenUri)
            .header("Authorization", "Basic $basic")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(
                BodyInserters.fromFormData("grant_type", "authorization_code")
                    .with("code", code)
                    .with("redirect_uri", s.redirectUri),
            )
            .retrieve()
            .awaitBody()

        val idToken = tokenResponse["id_token"] as? String
            ?: throw IllegalStateException("id_token 이 없습니다. (openid scope 필요)")
        val claims = decodeJwtPayload(idToken)

        // id_token claims 예시: sub, account_id(LDAP id), email, display_name, name
        val ldapId = (claims["account_id"] ?: claims["sub"])?.toString()
            ?: throw IllegalStateException("id_token 에 account_id/sub 가 없습니다.")
        return ExternalIdentity(
            provider = IdpProvider.SSO,
            subject = claims["sub"]?.toString() ?: ldapId,
            ldapId = ldapId,
            email = claims["email"]?.toString(),
            displayName = (claims["display_name"] ?: claims["name"])?.toString(),
        )
    }

    override fun logoutUrl(postLogoutRedirect: String?): String? {
        val s = props.sso
        val builder = UriComponentsBuilder.fromUriString(s.logoutUri)
            .queryParam("client_id", s.clientId)
        if (postLogoutRedirect != null) builder.queryParam("post_logout_redirect_uri", postLogoutRedirect)
        return builder.build().encode().toUriString()
    }

    private fun decodeJwtPayload(jwt: String): Map<String, Any> {
        val parts = jwt.split(".")
        require(parts.size >= 2) { "잘못된 JWT 형식" }
        val payload = String(Base64.getUrlDecoder().decode(parts[1]))
        return objectMapper.readValue(payload, object : TypeReference<Map<String, Any>>() {})
    }
}
