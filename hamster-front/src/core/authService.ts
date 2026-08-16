import {authApiClient, refreshAccessToken, setAccessToken, type RefreshResult} from "@/core/http/libraryClient.ts";

// 인증 API origin. 로그인은 브라우저 전체 이동(302→IDP)이라 axios 가 아닌 location 으로 처리한다.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';
const AUTH_BASE = `${API_BASE_URL}/api/v0/auth`;

// 백엔드 user 객체(=/refresh, /me 응답의 user 필드).
export interface AuthUser {
    ldapId: string;
    email: string | null;
    displayName: string | null;
    department: string | null;
    roles: string[];
}

interface LogoutResponse {
    logoutUrl?: string;
}

export const authService = {
    /**
     * 로그인 시작: 백엔드 /auth/login 으로 브라우저를 보내고(302→IDP), 로그인 후 redirect 경로로 복귀.
     * demo('admin'|'user') 는 개발용 Mock IDP 에서 데모 계정을 고르는 힌트(운영 IDP 는 무시).
     */
    startLogin(redirectPath = '/', demo?: 'admin' | 'user'): void {
        const params = new URLSearchParams({redirect: redirectPath});
        if (demo) params.set('demo', demo);
        window.location.href = `${AUTH_BASE}/login?${params.toString()}`;
    },

    // refresh 쿠키로 세션 부트스트랩(access token 메모리 적재). 실패 시 null.
    refresh(): Promise<RefreshResult | null> {
        return refreshAccessToken();
    },

    // 현재 사용자 조회(Authorization: Bearer). libraryApiClient 와 동일하게 401 시 refresh 가 동작하도록 별도 처리는 두지 않는다.
    async me(): Promise<AuthUser> {
        const {data} = await authApiClient.get<AuthUser>('/api/v0/auth/me');
        return data;
    },

    // 로그아웃: 쿠키 제거 + 메모리 토큰 초기화. logoutUrl 이 오면 호출부가 사용할 수 있다.
    async logout(): Promise<LogoutResponse> {
        try {
            const {data} = await authApiClient.post<LogoutResponse>('/api/v0/auth/logout');
            return data ?? {};
        } catch {
            return {};
        } finally {
            setAccessToken(null);
        }
    },
};
