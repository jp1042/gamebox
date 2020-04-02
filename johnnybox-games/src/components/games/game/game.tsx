import React, { useContext } from "react";
import * as PIXI from 'pixi.js'

import "./game.scss";

export const Game = (): any => {
    runGame();
    return (null)
}

const runGame = () => {

    const app = new PIXI.Application(
        {
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true
        });

    document.body.appendChild(app.view);

    // Listen for frame updates
    app.ticker.add(() => {
    });
}
