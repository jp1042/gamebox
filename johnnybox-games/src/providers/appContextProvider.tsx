import React, { useState } from "react";
import { ClientType } from "../components/lobby/lobby";
import { AppContext } from "..";

const roomData = () => {
    const roomData = localStorage.getItem('roomData');

    if (roomData) {
        const { roomCode, username, clientType } = JSON.parse(roomData)

        return {
            roomCode,
            username,
            clientType: parseInt(clientType)
        }
    }
    return {
        roomCode: null,
        username: null,
        clientType: ClientType.Unset
    }
}

export const initialAppContext = {
    roomCode: roomData().roomCode,
    username: roomData().username,
    clientType: roomData().clientType,
    users: [],
    userCount: 0
};

export const AppContextProvider = (props: any) => {
    const [appContextState, setAppContextState] = useState(initialAppContext);

    return (
        <AppContext.Provider value={[appContextState, setAppContextState]}>
            {props.children}
        </AppContext.Provider>
    )
};