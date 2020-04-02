import React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import io from "socket.io-client";
import { ClientType } from './components/lobby/lobby';

const socket = io.connect("http://localhost:8080");

export const SocketContext = React.createContext(socket);
export const AppContext = React.createContext(null);

ReactDOM.render(
    <App />, document.getElementById('root')
);
