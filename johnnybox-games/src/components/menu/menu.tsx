import * as React from "react";
import { AppContext, SocketContext } from "../..";
import { useContext, useState } from "react";
import { ClientType } from "../lobby/lobby";

import "./menu.scss";

export const Menu = () => {
    const [{ roomCode, username }, setAppContextState] = useContext(AppContext);
    const [fullScreen, setFullScreen] = useState(false);
    const socket = useContext(SocketContext);

    const leaveRoom = (e) => {
        e.preventDefault();
        socket.emit("leave", roomCode, username, leaveRoomCallback)
    }

    const leaveRoomCallback = () => {
        localStorage.removeItem("roomData");
        setAppContextState({ roomCode: null, username: null, clientType: ClientType.Unset })
    };

    const toggleFullScreen = () => {
        let doc: any = window.document;
        let docEl: any = doc.documentElement;
        let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
            setFullScreen(true);
        }
        else {
            cancelFullScreen.call(doc);
            setFullScreen(false);
        }
    }

    return (
        <nav className="menu">
            {!roomCode &&
                <h1>
                    JohnnyBox Games
            </h1>
            }
            {roomCode &&
                <div className="room-code-wrapper">
                    <div className="material-icons">home</div>
                    {roomCode}
                    <button
                        className="material-icons style"
                        onClick={toggleFullScreen}
                    >
                        {fullScreen ? 'fullscreen_exit' : 'fullscreen'}
                    </button>
                    <button
                        className="material-icons style"
                        onClick={leaveRoom}
                    >
                        close
                    </button>
                </div>
            }
        </nav >
    )
}
