import React, { useContext } from "react";
import { SocketContext } from "../index";

export const SocketProvider = (props: any) => {
    const socket = useContext(SocketContext);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
};