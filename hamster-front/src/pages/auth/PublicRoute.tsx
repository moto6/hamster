import {Navigate, Outlet} from "react-router-dom";

export function PublicRoute() {
    const isAuthorized = !!localStorage.getItem('Authorization');
    return isAuthorized ? <Navigate to="/admin" replace/> : <Outlet/>;
}