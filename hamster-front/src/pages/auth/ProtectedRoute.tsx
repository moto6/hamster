import {RequireAuth} from "@/core/auth/RequireAuth.tsx";

// 기존 라우트 호환용 래퍼. 실제 인증/역할 게이팅은 RequireAuth(AuthContext 기반) 가 담당한다.
export function ProtectedRoute() {
    return <RequireAuth/>;
}
