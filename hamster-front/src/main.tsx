// @/main.tsx
import './index.css'
import {GNB_NAV_ITEMS} from "@/app/gnb/navigation.config.tsx";
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {AdminLayout} from "@/app/AdminLayout.tsx";
import {LoginPage} from "@/pages/auth/LoginPage.tsx";
import {CallbackPage} from "@/pages/auth/CallbackPage.tsx";
import {PublicRoute} from "@/pages/auth/PublicRoute.tsx";
import {ProtectedRoute} from "@/pages/auth/ProtectedRoute.tsx";
import {AuthProvider} from "@/core/auth/AuthContext.tsx";
import {RequireAuth} from "@/core/auth/RequireAuth.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* 공개 경로 */}
                    <Route path="/auth/callback" element={<CallbackPage/>}/>
                    <Route element={<PublicRoute/>}>
                        <Route path="/login" element={<LoginPage/>}/>
                    </Route>

                    {/* 보호 경로 (로그인 필요) */}
                    <Route element={<ProtectedRoute/>}>
                        <Route element={<AdminLayout/>}>
                            <Route path="/" element={<Navigate to="/admin" replace/>}/>
                            {GNB_NAV_ITEMS.map((item) => (
                                <Route
                                    key={item.path}
                                    path={item.path}
                                    // roles 가 지정된 메뉴는 역할까지 검증.
                                    element={
                                        item.roles && item.roles.length > 0
                                            ? <RequireAuth roles={item.roles}>{item.element}</RequireAuth>
                                            : item.element
                                    }
                                />
                            ))}
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/login" replace/>}/>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
);
