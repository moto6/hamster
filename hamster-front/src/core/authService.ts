import {libraryApiClient} from "@/core/http/libraryClient.ts";

export interface JwtIssueResponse {
    tokenType: string;
    separator: string;
    accessToken: string;
    expiresIn: number | null;
}

const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true';
const DEMO_AUTH: JwtIssueResponse = {
    tokenType: 'Bearer',
    separator: ' ',
    accessToken: 'eyJhbGciOiJIUzM4NCJ9.eyJ1c3IiOiJkZW1vIiwiZW1sIjoiZGVtb0BkZW1vLmNvbSIsImRubSI6ImRlbW9AZGVtby5jb20iLCJqdGkiOiJiY2ViYWNlMS1mN2RjLTRiNDctOTJlMS0zY2ZhZjNhMThmMWQiLCJpYXQiOjE3NzE1Njg3OTgsIm5iZiI6MTc3MTU2ODc5OCwiZXhwIjoxNzc0Nzg2Nzk4fQ.Xx246MHjjNQ4UOOxxwm7grxC0_NQ4ZjJ70CKWJK21Tly0rYWC9jAvJRhkq_quWqp',
    expiresIn: null,
}

export const authService = {

    async login(email: string, password: string): Promise<JwtIssueResponse> {
        if (IS_MOCK) return DEMO_AUTH;

        const {data} = await libraryApiClient.post<JwtIssueResponse>('/api/v0/auth/tokens', {
            email: email,
            password: password,
        });
        return data;
    },

    setToken(data: JwtIssueResponse) {
        const fullToken = `${data.tokenType}${data.separator}${data.accessToken}`;
        localStorage.setItem('Authorization', fullToken);
    },

    logout() {
        localStorage.removeItem('Authorization');
        // 세션 초기화가 필요하면 여기서 추가 로직 수행
        window.location.href = '/login';
    },

    isLoggedIn(): boolean {
        return !!localStorage.getItem('Authorization');
    }
};