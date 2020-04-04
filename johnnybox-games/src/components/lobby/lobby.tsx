import React, { useRef, useContext, useState } from 'react';

import './lobby.scss';
import { SocketContext, AppContext } from '../..';

export enum ClientType {
    Unset,
    Host,
    Guest,
    Viewer
}

export enum ErrorType {
    RoomDoesNotExist,
    UsernameExists,
    Error
}

//to do handle disconnect

export const Lobby = () => {
    const [{ roomCode, clientType }, setAppContextState] = useContext(AppContext);
    const [roomUnavailableError, setRoomUnavailableError] = useState(false);
    const [usernameUnavailableError, setUsernameUnavailableError] = useState(false);
    const roomCodeInput = useRef(null);
    const usernameInput = useRef(null);
    const socket = useContext(SocketContext);

    const clickHandler = (e, selectedClientType: ClientType) => {
        e.preventDefault();
        const inputRoomCode = roomCodeInput.current.value;
        const inputUsername = usernameInput.current.value;

        if (validateFields(inputRoomCode, inputUsername)) {
            if (selectedClientType === ClientType.Host) {
                socket.emit("create", inputRoomCode, inputUsername, createRoomCallback)
            }
            if (selectedClientType === ClientType.Guest) {
                socket.emit("join", inputRoomCode, inputUsername, joinRoomCallback)
            }
        }
    }

    const validateFields = (inputRoomCode, inputUsername) => {

        !inputUsername && usernameInput.current.focus();
        !inputRoomCode && roomCodeInput.current.focus();

        return inputRoomCode && inputUsername;
    }

    const createRoomCallback = (response) => {
        if (response.success) {
            setAppContextState(response);
            localStorage.setItem('roomData', JSON.stringify(response));
        } else {
            setRoomUnavailableError(true);
            roomCodeInput.current.focus();
        }
    };

    const joinRoomCallback = (response) => {
        if (response.success) {
            setAppContextState(response)
            localStorage.setItem('roomData', JSON.stringify(response));
        } else if (response.error === ErrorType.RoomDoesNotExist) {
            setRoomUnavailableError(true);
            roomCodeInput.current.focus();
        } else if (response.error === ErrorType.UsernameExists) {
            setUsernameUnavailableError(true);
            usernameInput.current.focus();
        } else {
            setRoomUnavailableError(true);
            roomCodeInput.current.focus();
        }
    };

    if (roomCode && clientType) {
        return null;
    }

    return (
        <section className="lobby">
            {roomUnavailableError &&
                <div className="room-error-message">
                    Room exists or not available
                </div>
            }
            <input
                ref={roomCodeInput}
                onChange={() => roomUnavailableError && setRoomUnavailableError(false)}
                type="text"
                placeholder="Enter room code"
                className={`room-input ${roomUnavailableError ? 'error' : ''}`}
            />
            {usernameUnavailableError &&
                <div className="room-error-message">
                    username taken
                </div>
            }
            <input
                ref={usernameInput}
                onChange={() => usernameUnavailableError && setUsernameUnavailableError(false)}
                type="text"
                placeholder="Enter username"
                className={`room-input ${roomUnavailableError ? 'error' : ''}`}
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