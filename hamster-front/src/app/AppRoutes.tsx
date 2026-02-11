// @/app/AppRoutes.tsx
import {Navigate, Route, Routes} from "react-router-dom";
import {AdminLayout} from "@/app/AdminLayout.tsx";
import {GNB_NAV_ITEMS} from "@/app/gnb/navigation.config.tsx";

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<AdminLayout/>}>
                <Route path="/" element={<Navigate to="/admin" replace/>}/>
                {GNB_NAV_ITEMS.map((item) => (
                    <Route key={item.path} path={item.path} element={item.element}/>
                ))}
            </Route>
        </Routes>
    );
}