// @/main.tsx
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {AdminLayout} from "@/app/AdminLayout.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import './index.css'
import {GNB_NAV_ITEMS} from "@/app/gnb/navigation.config.tsx";
// import {LoginPage} from "@/pages/auth/LoginPage.tsx";
// import {PublicRoute} from "@/pages/auth/PublicRoute.tsx";
// import {ProtectedRoute} from "@/pages/auth/ProtectedRoute.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                {/*<Route element={<PublicRoute/>}>*/}
                {/*    <Route path="/login" element={<LoginPage/>}/>*/}
                {/*</Route>*/}
                {/* BEGIN PROTECTED */}
                {/*<Route element={<ProtectedRoute/>}>*/}
                    <Route element={<AdminLayout/>}>
                        <Route path="/" element={<Navigate to="/admin" replace/>}/>
                        {GNB_NAV_ITEMS.map((item) => (
                            <Route
                                key={item.path}
                                path={item.path}
                                element={item.element}
                            />
                        ))}
                    </Route>
                {/*</Route>*/}
                {/* END PROTECTED */}
                <Route path="*" element={<Navigate to="/login" replace/>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);