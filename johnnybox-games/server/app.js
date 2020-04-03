var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);

var publicPath = path.resolve(__dirname, '../public/');

app.use(express.static(publicPath))

app.get('/', function (req, res) {
    res.send('index.html', { root: publicPath });
});

io.on('connection', function (socket) {
    console.log("connected");

    // socket.emit("rejoin");

    socket.on('message', function (message) {
        //io.to(roomCode).emit("broadcastMessage", {text:message, username, id: new ObjectId()});
    });

    socket.on('test', function (roomCode, message) {
        socket.to(roomCode).emit("broadcastMessage", message);
        //io.to(roomCode).emit("broadcastMessage", {text:message, username, id: new ObjectId()});
    });

    socket.on('join', function (data, onJoinCallback) {
        //Host
        if (data.selectedClientType === 1) {
            let roomExists = !!io.sockets.adapter.rooms[data.inputRoomCode];

            !roomExists && socket.join(data.inputRoomCode);

            return onJoinCallback({
                success: !roomExists,
                clientType: 1,
                roomCode: data.inputRoomCode
            });
        }
        //io.to(roomCode).emit("broadcastMessage", {text:message, username, id: new ObjectId()});
    });

    socket.on('leave', function (roomCode, leaveRoomCallback) {
        socket.leave(roomCode);
        return leaveRoomCallback();
    });
});


http.listen(8080, function () {
    console.log('listening on *:8080');
});
