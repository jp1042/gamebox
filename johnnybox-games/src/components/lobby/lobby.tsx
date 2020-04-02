import React, { useRef, useContext } from 'react';

import './lobby.scss';
import { SocketContext, AppContext } from '../..';

export enum ClientType {
    Unset,
    Host,
    Guest,
    Viewer
}

//to do handle disconnect

export const Lobby = () => {
    const [{ roomCode, clientType }, setAppContextState] = useContext(AppContext);
    const input = useRef(null);
    const socket = useContext(SocketContext);

    const clickHandler = (e, selectedClientType: ClientType) => {
        e.preventDefault();
        const inputRoomCode = input.current.value;

        if (!inputRoomCode) {
            input.current.focus();
        } else {
            socket.emit("join", { selectedClientType, inputRoomCode })
        }
    }

    socket.on("joined", (response) => {
        if (response.success && response.roomCode) {
            setAppContextState({ roomCode: response.roomCode, clientType: response.clientType })
            localStorage.setItem('roomCode', response.roomCode);
            localStorage.setItem('clientType', response.clientType);
        }
    });

    socket.on("rejoin", () => {
        socket.emit("join", { selectedClientType: clientType, inputRoomCode: roomCode })
    })

    if (roomCode && clientType) {
        return null;
    }

    return (
        <section className="lobby">
            <input
                ref={input}
                type="text"
                placeholder="Enter room code"
                className="room-input"
            />
            <button onClick={e => clickHandler(e, ClientType.Host)}>
                Create room
            </button>
            <button onClick={e => clickHandler(e, ClientType.Guest)}>
                Join room
            </button>
            <button onClick={e => clickHandler(e, ClientType.Viewer)}>
                View room
            </button>
        </section>
    )
}