import * as React from "react";
import { AppContext, SocketContext } from "../..";
import { useContext } from "react";
import { ClientType } from "../lobby/lobby";

import "./menu.scss";

export const Menu = () => {
    const [{ roomCode }, setAppContextState] = useContext(AppContext);
    const socket = useContext(SocketContext);

    const leaveRoom = (e) => {
        e.preventDefault();
        socket.emit("leave", roomCode, leaveRoomCallback)
    }

    const leaveRoomCallback = () => {
        localStorage.removeItem("roomCode");
        localStorage.removeItem("clientType");
        setAppContextState({ roomCode: null, clientType: ClientType.Unset })
    };

    return (
        <nav className="menu">
            <h1>
                JohnnyBox Games
            </h1>
            <div className="room-code-wrapper">
                <div className="material-icons">home</div>
                {roomCode}
                <button
                    className="material-icons close"
                    onClick={leaveRoom}
                >
                    close
                </button>
            </div>
        </nav >
    )
}
