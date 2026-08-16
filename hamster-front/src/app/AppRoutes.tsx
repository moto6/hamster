// @/app/AppRoutes.tsx
// 참고용 라우트 정의(현재 진입점은 main.tsx). 인증/역할 게이팅은 RequireAuth(AuthContext) 로 단일화.
import {Navigate, Route, Routes} from "react-router-dom";
import {AdminLayout} from "@/app/AdminLayout.tsx";
import {GNB_NAV_ITEMS} from "@/app/gnb/navigation.config.tsx";
import {RequireAuth} from "@/core/auth/RequireAuth.tsx";

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<RequireAuth/>}>
                <Route element={<AdminLayout/>}>
                    <Route path="/" element={<Navigate to="/admin" replace/>}/>
                    {GNB_NAV_ITEMS.map((item) => (
                        <Route
                            key={item.path}
                            path={item.path}
                            element={
                                item.roles && item.roles.length > 0
                                    ? <RequireAuth roles={item.roles}>{item.element}</RequireAuth>
                                    : item.element
                            }
                        />
                    ))}
                </Route>
            </Route>
        </Routes>
    );
}
