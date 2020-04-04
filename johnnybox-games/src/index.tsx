import React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import io from "socket.io-client";
import { ClientType } from './components/lobby/lobby';
import { initialAppContext } from './providers/appContextProvider';

const socket = io.connect();

if (initialAppContext.roomCode) {
    socket.emit("rejoin", initialAppContext.roomCode);
}

export const SocketContext = React.createContext(socket);
export const AppContext = React.createContext(null);

ReactDOM.render(
    <App />, document.getElementById('root')
);
