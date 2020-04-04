var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://nhojrekrap:CLownfish23!@partyvibes-r4e8r.mongodb.net/";

const publicPath = path.resolve(__dirname, '../public/');


app.use(express.static(publicPath))

app.get('/', function (req, res) {
    res.send('index.html', { root: publicPath });
});

MongoClient.connect(uri, { useNewUrlParser: true })
    .then(client => {
        io.on('connection', function (socket) {
            console.log("connected");
            const roomsDbCollection = client.db("JohnnyBoxGames").collection("Rooms");

            socket.on('create', async function (roomCode, username, onCreateRoomCallback) {
                const success = await createRoom(roomCode, username, roomsDbCollection);
                success && socket.join(roomCode);

                return onCreateRoomCallback({
                    success,
                    clientType: 1,
                    roomCode,
                    username
                });
            });

            socket.on('join', async function (roomCode, username, onJoinCallback) {
                const { success, error } = await joinRoom(roomCode, username, roomsDbCollection, socket, onJoinCallback);
                success && socket.join(roomCode);

                return onJoinCallback({
                    success,
                    error,
                    clientType: 2,
                    roomCode,
                    username,
                });
            });

            socket.on('rejoin', function (roomCode) {
                socket.join(roomCode);
            });

            socket.on('leave', async function (roomCode, username, leaveRoomCallback) {
                const success = await leaveRoom(roomCode, username, roomsDbCollection);
                success && socket.leave(roomCode);

                return leaveRoomCallback();
            });
        });
    });

function createRoom(roomCode, username, roomsDbCollection) {
    let roomExists = !!io.sockets.adapter.rooms[roomCode];

    if (!roomExists) {
        return roomsDbCollection.insertOne(
            {
                _id: roomCode,
                users: [{ username }],
                userCount: 1
            },
            { writeConcern: { w: 1 } })
            .then(() => { return true })
            .catch(err => { return false });
    } else {
        return false;
    }
}

function joinRoom(roomCode, username, roomsDbCollection) {
    let roomExists = !!io.sockets.adapter.rooms[roomCode];

    if (roomExists) {
        return roomsDbCollection.findOneAndUpdate(
            { _id: roomCode, users: { $nin: [{ username }] } },
            { $push: { users: { username } }, $inc: { userCount: 1 } },
            { writeConcern: { w: 1 }, returnOriginal: false })
            .then(response => {
                if (response.lastErrorObject.updatedExisting) {
                    io.to(roomCode).emit("roomUpdate", response.value);
                    return { success: true, error: null } //Success
                }
                else {
                    return { success: false, error: 1 } //UsernameExists
                }
            })
            .catch(err => { return { success: false, error: 2 } }) //Error
    } else {
        return { success: false, error: 0 } //RoomDoesNotExist
    }
}

function leaveRoom(roomCode, username, roomsDbCollection) {
    let roomExists = !!io.sockets.adapter.rooms[roomCode];

    if (roomExists) {
        console.log("here");
        return roomsDbCollection.findOneAndUpdate(
            { _id: roomCode, users: { $in: [{ username }] } },
            { $pull: { users: { $in: [{ username }] } }, $inc: { userCount: -1 } },
            { writeConcern: { w: 1 }, returnOriginal: false })
            .then(response => {
                if (response.lastErrorObject.updatedExisting) {
                    io.to(roomCode).emit("leaveRoom", response.value);

                    response.value
                        && response.value.userCount === 0
                        && deleteRoom(roomCode, roomsDbCollection);

                    return true;
                }
                else {
                    return false;
                }
            })
            .catch(err => { return false })
    } else {
        return false;
    }
}

function deleteRoom(roomCode, roomsDbCollection) {
    return roomsDbCollection.deleteOne(
        { _id: roomCode });
}


http.listen(8080, function () {
    console.log('listening on *:8080');
});
