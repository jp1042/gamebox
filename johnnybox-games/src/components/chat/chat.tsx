import React, { useRef, useContext, useState } from 'react';
import FlipMove from 'react-flip-move';
import { Emojione } from "react-emoji-render";
import { SocketContext, AppContext } from '../..';

import './chat.scss';

export const Chat = () => {
    const [appContextState] = useContext(AppContext);
    const { roomCode, username } = appContextState;
    const [messages, setMessages] = useState([]);
    const socket = useContext(SocketContext)
    const inputRef = useRef(null);

    socket.off('chat-message');
    socket.on('chat-message', (text, username, id) => {
        setMessages([...messages, { text, username, id }]);
    });

    const sendMessage = (e) => {
        e.preventDefault();
        const inputMessage = inputRef.current.value;

        if (inputMessage) {
            socket.emit("chat-message", roomCode, username, inputMessage);
            inputRef.current.value = '';
        }
    }

    const renderMessages = () => {
        return (
            <ul>
                <FlipMove className="message-window">
                    {
                        messages.map((message) => (
                            <li key={message.id} className="message-wrapper">
                                <div className="message" >
                                    <div className="message-text">
                                        <Emojione onlyEmojiClassName="only-emoji" text={message.text} />
                                    </div>
                                    <div className="message-username">
                                        {message.username}
                                    </div>
                                </div>
                            </li>
                        ))
                    }
                </FlipMove>
            </ul>
        );

    }

    return (
        <div className="chat">
            {renderMessages()}
            <div className="message-field">
                <input
                    ref={inputRef}
                    type="text"
                    className="message-input"
                />
                <button onClick={sendMessage} className="material-icons">send</button>
            </div>
        </div>
    )
}