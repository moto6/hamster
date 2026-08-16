import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "@/core/auth/AuthContext.tsx";

// 공개 경로 가드. 이미 인증된 사용자는 앱 홈으로 보낸다(부트스트랩 중에는 통과시켜 깜빡임 방지).
export function PublicRoute() {
    const {status} = useAuth();
    if (status === 'authed') return <Navigate to="/admin" replace/>;
    return <Outlet/>;
}
