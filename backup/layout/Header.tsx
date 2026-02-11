import React, {type ReactNode} from "react";

const Header: React.FC<{ children?: ReactNode }> = ({children}) => {
    return (
        <header className="header navbar navbar-expand-lg" style={{backgroundColor: "#c2d7e9"}}>
            <div className={"container-fluid"}>
                <div className="d-flex align-items-center text-white">
                    {children}
                </div>
            </div>
        </header>
    )
};

export default Header;

