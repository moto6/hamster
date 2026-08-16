package com.hamsterapi.auth.iam.exception

/** 인증 실패 계열의 상위 예외(→ 401). GlobalExceptionHandler 가 상태코드로 매핑한다. */
open class UnauthorizedException(message: String) : RuntimeException(message)

/** 보호 경로인데 토큰이 아예 없음. */
class AuthenticationRequiredException(message: String = "인증이 필요합니다.") : UnauthorizedException(message)

/** access token 서명/만료/형식 오류. */
class InvalidAccessTokenException(message: String) : UnauthorizedException(message)

/** refresh token 미존재/만료/재사용 등. */
class InvalidRefreshTokenException(message: String) : UnauthorizedException(message)

/**
 * IDP 콜백의 state 불일치(CSRF 의심).
 * 응답에는 일반 문구만 나가고, 구체적 정황은 서버 로그에만 남긴다.
 */
class InvalidAuthStateException : UnauthorizedException("로그인 요청이 유효하지 않습니다. 다시 시도해 주세요.")
