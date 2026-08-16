import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAuth} from "@/core/auth/AuthContext.tsx";

/**
 * 백엔드 /api/v0/auth/callback 이 refresh 쿠키를 심고 이리로 302 시킨다.
 * AuthProvider 가 마운트 시 /auth/refresh 로 세션을 부트스트랩하므로,
 * 여기서는 status 가 정해지면 redirect 목적지로 이동만 한다.
 */
export function CallbackPage() {
    const {status} = useAuth();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const redirect = params.get('redirect') || '/';

    useEffect(() => {
        if (status === 'authed') navigate(redirect, {replace: true});
        else if (status === 'anon') navigate('/login', {replace: true});
    }, [status, redirect, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <p className="text-sm text-slate-500">로그인 처리 중…</p>
        </div>
    );
}
