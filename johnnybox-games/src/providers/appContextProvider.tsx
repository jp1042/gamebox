import React, { useState } from "react";
import { ClientType } from "../components/lobby/lobby";
import { AppContext } from "..";

const roomData = () => {
    if (localStorage.getItem('roomCode') && localStorage.getItem('clientType')) {
        return {
            roomCode: localStorage.getItem("roomCode"),
            clientType: parseInt(localStorage.getItem("clientType"))
        }
    }
    return {
        roomCode: null,
        clientType: ClientType.Unset
    }
}

export const initialAppContext = {
    roomCode: roomData().roomCode,
    clientType: roomData().clientType
};

export const AppContextProvider = (props: any) => {
    const [appContextState, setAppContextState] = useState(initialAppContext);

    return (
        <AppContext.Provider value={[appContextState, setAppContextState]}>
            {props.children}
        </AppContext.Provider>
    )
};