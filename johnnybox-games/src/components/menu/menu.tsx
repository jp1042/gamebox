import * as React from "react";

import "./menu.scss";
import { AppContext } from "../..";
import { useContext } from "react";

export const Menu = () => {

    const [{ roomcode, clientType }, setAppContextState] = useContext(AppContext);
    return (
        <nav className="menu">
            Test 3
        </nav>
    )
}
