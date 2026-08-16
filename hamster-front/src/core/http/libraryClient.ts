import axios, {type AxiosError, type InternalAxiosRequestConfig} from 'axios';

// API 베이스 URL. 개발: VITE_API_URL(교차 origin), 배포: 빈 값 → 상대경로(same-origin, 프록시).
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

// access token 은 메모리에만 보관(localStorage 미사용 → XSS 토큰 탈취 표면 축소).
// refresh token 은 백엔드가 HttpOnly 쿠키로 관리하므로 JS 는 접근하지 않는다.
let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => {
    accessToken = t;
};
export const getAccessToken = () => accessToken;

// 인증 API(/api/v0/auth/*) 전용 클라이언트. refresh 쿠키 전송을 위해 withCredentials 고정.
export const authApiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 업무(도서관 등) API 호출용 공용 클라이언트.
export const libraryApiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface RefreshUser {
    ldapId: string;
    email: string | null;
    displayName: string | null;
    department: string | null;
    roles: string[];
}

interface RefreshResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number | null;
    user: RefreshUser;
}

export interface RefreshResult {
    accessToken: string;
    user: RefreshUser;
}

// 동시에 여러 401 이 발생해도 refresh 는 한 번만 수행(중복요청 합치기 = single-flight).
let inflightRefresh: Promise<RefreshResult | null> | null = null;

/**
 * refresh 쿠키로 access token 재발급. 진행 중인 요청이 있으면 그 Promise 를 공유한다.
 * 성공 시 메모리에 access token 을 적재하고, 실패 시 null 을 반환한다.
 */
export function refreshAccessToken(): Promise<RefreshResult | null> {
    if (!inflightRefresh) {
        inflightRefresh = authApiClient
            .post<RefreshResponse>('/api/v0/auth/refresh')
            .then(({data}) => {
                setAccessToken(data.accessToken);
                return {accessToken: data.accessToken, user: data.user};
            })
            .catch(() => {
                setAccessToken(null);
                return null;
            })
            .finally(() => {
                inflightRefresh = null;
            });
    }
    return inflightRefresh;
}

// 재시도 여부 표시용 플래그(원본 요청 1회만 재시도).
interface RetryableConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// 요청 인터셉터: 메모리의 access token 을 Authorization 헤더로 첨부.
libraryApiClient.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// 응답 인터셉터: 401 이면 single-flight refresh 후 원본 요청을 1회 재시도.
libraryApiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original = error.config as RetryableConfig | undefined;

        if (error.response?.status === 401 && original && !original._retry) {
            original._retry = true;
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                original.headers.Authorization = `Bearer ${refreshed.accessToken}`;
                return libraryApiClient(original);
            }
        }
        return Promise.reject(error);
    },
);
