import type {ReactNode} from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAuth} from '@/core/auth/AuthContext.tsx';
import type {Role} from '@/core/auth/role.ts';

interface RequireAuthProps {
    children?: ReactNode;
    /** 지정 시 이 역할 중 하나라도 가진 사용자만 접근 허용(없으면 인증만 확인). */
    roles?: Role[];
}

/**
 * 인증 가드. 미인증이면 /login 으로 보낸다(원래 경로를 state.from 으로 보존).
 * roles 가 지정되면 역할까지 검증한다. children 없이 라우트 element 로 쓰면 <Outlet/> 을 렌더한다.
 */
export function RequireAuth({children, roles}: RequireAuthProps) {
    const {status, hasAnyRole} = useAuth();
    const location = useLocation();

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <p className="text-sm text-slate-500">불러오는 중…</p>
            </div>
        );
    }

    if (status === 'anon') {
        return <Navigate to="/login" replace state={{from: location.pathname + location.search}}/>;
    }

    // 역할 게이팅: 부족하면 홈으로(추가 권한 화면이 생기면 별도 처리).
    if (roles && roles.length > 0 && !hasAnyRole(roles)) {
        return <Navigate to="/" replace/>;
    }

    return <>{children ?? <Outlet/>}</>;
}

export default RequireAuth;
