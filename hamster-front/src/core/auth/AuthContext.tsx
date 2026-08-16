import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import type {ReactNode} from 'react';
import {authService, type AuthUser} from '@/core/authService.ts';
import {setAccessToken} from '@/core/http/libraryClient.ts';
import type {Role} from '@/core/auth/role.ts';

// 화면에서 다루기 쉬운 형태로 가공한 사용자.
export interface User {
    ldapId: string;
    email: string | null;
    displayName: string;
    department: string;
    roles: Role[];
    initials: string;
}

type AuthStatus = 'loading' | 'authed' | 'anon';

interface AuthState {
    user: User | null;
    roles: Role[];
    status: AuthStatus;
    isAuthenticated: boolean;
    login: (redirectPath?: string, demo?: 'admin' | 'user') => void;
    logout: () => Promise<void>;
    hasRole: (role: Role) => boolean;
    hasAnyRole: (roles: Role[]) => boolean;
}

function toUser(a: AuthUser): User {
    const base = a.displayName || a.ldapId;
    return {
        ldapId: a.ldapId,
        email: a.email,
        displayName: a.displayName || a.ldapId,
        department: a.department ?? '',
        roles: (a.roles ?? []) as Role[],
        initials: (base?.trim()?.[0] ?? '?').toUpperCase(),
    };
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [status, setStatus] = useState<AuthStatus>('loading');

    // 앱 로드 시 refresh 쿠키로 세션 부트스트랩 (access token 메모리 적재).
    useEffect(() => {
        let alive = true;
        authService.refresh().then((res) => {
            if (!alive) return;
            if (res) {
                setUser(toUser(res.user));
                setStatus('authed');
            } else {
                setUser(null);
                setStatus('anon');
            }
        });
        return () => {
            alive = false;
        };
    }, []);

    const login = useCallback(
        (redirectPath = '/', demo?: 'admin' | 'user') => authService.startLogin(redirectPath, demo),
        [],
    );

    const logout = useCallback(async () => {
        const {logoutUrl} = await authService.logout();
        setAccessToken(null);
        setUser(null);
        setStatus('anon');
        // IDP 로그아웃 URL 이 오면 그쪽으로, 아니면 로그인 페이지로.
        window.location.href = logoutUrl ?? '/login';
    }, []);

    const roles = user?.roles ?? [];

    const hasRole = useCallback((role: Role) => roles.includes(role), [roles]);
    const hasAnyRole = useCallback((rs: Role[]) => rs.some((r) => roles.includes(r)), [roles]);

    const value = useMemo<AuthState>(
        () => ({
            user,
            roles,
            status,
            isAuthenticated: status === 'authed',
            login,
            logout,
            hasRole,
            hasAnyRole,
        }),
        [user, roles, status, login, logout, hasRole, hasAnyRole],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

/** 인증된 트리(레이아웃 하위)에서 현재 사용자. 가드가 보장하므로 non-null. */
export function useUser(): User {
    const {user} = useAuth();
    if (!user) throw new Error('useUser called without an authenticated user');
    return user;
}
