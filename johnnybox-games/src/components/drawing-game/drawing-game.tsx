import "./drawing-game.scss";
import React, { useContext } from 'react';
import { SocketContext } from "../../index";

export const DrawingGame = (): any => {
    const socket = useContext(SocketContext);

    runGame();

    return null;
}

const toggleFullScreen = () => {
    alert("test");
    var doc: any = window.document;
    var docEl: any = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    }
    else {
        cancelFullScreen.call(doc);
    }
}

const runGame = () => {
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    let mouse = { x: 0, y: 0 };
    let touch = { x: 0, y: 0 };

    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#00CC99';

    canvas.addEventListener('mousemove', function (e) {
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
    }, false);

    canvas.addEventListener('touchmove', function (e) {
        touch.x = e.touches[0].clientX - this.offsetLeft;
        touch.y = e.touches[0].clientY - this.offsetTop;
    }, false);

    canvas.addEventListener('mousedown', function (e) {
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        canvas && canvas.addEventListener('mousemove', onMousePaint, false);
    }, false);

    canvas.addEventListener('touchstart', function (e) {

        ctx.beginPath();
        ctx.moveTo(e.touches[0].clientX - this.offsetLeft, e.touches[0].clientY - this.offsetTop);

        canvas && canvas.addEventListener('touchmove', onTouchPaint, false);
    }, false);

    canvas.addEventListener('mouseup', function () {
        canvas && canvas.removeEventListener('mousemove', onMousePaint, false);
    }, false);

    canvas.addEventListener('touchend', function () {
        canvas && canvas.removeEventListener('touchmove', onTouchPaint, false);
    }, false);

    canvas.addEventListener('touchcancel', function () {
        canvas && canvas.removeEventListener('touchmove', onTouchPaint, false);
    }, false);


    // Touch


    var onMousePaint = () => {
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    };

    var onTouchPaint = () => {
        ctx.lineTo(touch.x, touch.y);
        ctx.stroke();
    }
}
