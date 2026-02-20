import {Navigate, Outlet} from "react-router-dom";

export function ProtectedRoute() {
    const isAuthorized = !!localStorage.getItem('Authorization');
    return isAuthorized ? <Outlet/> : <Navigate to="/login" replace/>;
}