const express = require('express')
const app = express()
const PORT = 5000

// Socket.io server uses an http server
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server, {pingInterval: 2000, pingTimeout: 5000}); // Faster timeout for disconnecting players

const path = require('path'); // Import the 'path' module

const backendPlayers = {};

app.use(express.static(path.join(__dirname, '../client'))); // Serve static javascript files from the 'client' folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
})

io.on('connection', (socket) => {
    console.log('a user connected');
    backendPlayers[socket.id] = {x: 10 + 50 * Math.random(), y: 50};
    io.emit('updatePlayers', backendPlayers);

    socket.on('disconnect', (reason) => {
        console.log(`a user disconnected with reason: ${reason}`);
        delete backendPlayers[socket.id];
        io.emit('updatePlayers', backendPlayers);
    })

    socket.on('keydown', (code) => {
        console.log("keydown")
        switch (code) {
            case "KeyA":
                backendPlayers[socket.id].leftHeld = true;
                break;
            case "KeyD":
                backendPlayers[socket.id].rightHeld = true;
                break;
            case "Space":
                if(backendPlayers[socket.id].onPlatform){
                    backendPlayers[socket.id].jumpHeld = true;
                }
                break;
        }
    })

    socket.on('keyup', (code) => {
        console.log("keyup")
        switch (code) {
            case "KeyA":
                backendPlayers[socket.id].leftHeld = false;
                break;
            case "KeyD":
                backendPlayers[socket.id].rightHeld = false;
                break;
            case "Space":
                if(backendPlayers[socket.id].onPlatform){
                    backendPlayers[socket.id].jumpHeld = false;
                    backendPlayers[socket.id].jump();
                }   
                break;
        }
    })
})

setInterval(() => {
    io.emit('updatePlayers', backendPlayers);
}, 15);

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})