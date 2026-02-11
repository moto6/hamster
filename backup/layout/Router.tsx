import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {routePages} from "./RoutePages.ts";

const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {routePages.map((item) => (
                    <Route key={item.path} path={item.path} element={<item.element/>}></Route>
                ))}
            </Routes>
        </BrowserRouter>
    );
}
export default Router;
