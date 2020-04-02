import * as React from 'react';
import { Menu } from './components/menu/menu';
import { SocketProvider } from './providers/socketProvider';

import './style/_resets.scss';
import { Game } from './components/games/game/game';
import { DrawingGame } from './components/drawing-game/drawing-game';
import { Lobby } from './components/lobby/lobby';
import { AppContextProvider } from './providers/appContextProvider';

const App = () => {
    return (
        <AppContextProvider>
            <SocketProvider>
                <div className="App">
                    <Menu />
                    <Lobby />
                    <DrawingGame />
                </div>
            </SocketProvider>
        </AppContextProvider>
    );
}

export default (App);
