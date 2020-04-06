import React, { useContext, useEffect, useState, useRef } from 'react';
import { SocketContext, AppContext } from '../..';
import FlipMove from 'react-flip-move';

import "./room.scss";
import { Chat } from '../chat/chat';

export const Room = () => {
    const [appContextState, setAppContextState] = useContext(AppContext);
    const { roomCode, username, users } = appContextState;
    const [displayUsers, setDisplayUsers] = useState(true);
    const socket = useContext(SocketContext);
    const showUsersButtonRef = useRef(null);

    socket.off("roomUpdate");
    socket.on("roomUpdate", (data) => {
        setAppContextState(
            {
                ...appContextState,
                users: data.users,
                userCount: data.userCount
            });
    })

    useEffect(() => {
        roomCode && setTimeout(() => {
            setDisplayUsers(false);
            showUsersButtonRef &&
                showUsersButtonRef.current &&
                showUsersButtonRef.current.focus();
        }, 1500);
    }, [roomCode]);

    if (!roomCode) {
        return null
    }

    return (
        <>
            <ul className={`users ${displayUsers ? 'show' : ''}`}>
                <h2>
                    users
            </h2>
                <FlipMove>
                    {users.map(user => {
                        return (
                            <li
                                className={username === user.username ? 'me' : ''}
                                key={user.username}
                            >
                                {user.username.charAt(0).toUpperCase()}
                            </li>
                        )
                    })}
                </FlipMove>
            </ul>
            <Chat />
            <div className="bottom-navigation">
                <button
                    className="material-icons style"
                    onClick={() => setDisplayUsers(!displayUsers)}
                    ref={showUsersButtonRef}
                >
                    people
                </button>
                <button className="material-icons style">chat_bubble_outline</button>
                <button className="material-icons style">emoji_events</button>
                <button className="material-icons style">sports_esports</button>
            </div>
        </>
    )
}