import React from "react";
import {routePages} from "./RoutePages.ts";

const Navigation: React.FC = () => {
    return (
        <nav className={"p-3"}>
            <ul className={"nav flex-column"}>
                <span className={"md-3 text-dark"}>marketplace admin</span>
                <div className="mt-5"></div>
                {routePages.map((route, index) => (
                    <li key={index} className={"nav-item"}>
                        <a className={"nav-link"} href={route.path}>{route.label}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
export default Navigation;
