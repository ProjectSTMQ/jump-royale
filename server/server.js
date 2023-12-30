// Setup express server
const express = require("express");
const app = express();
const PORT = 5000;

// Import classes
const Player = require("./classes/Player.js");
const Map = require("./classes/Map.js");

// Socket.io server uses an http server
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 }); // Faster timeout for disconnecting players

// Miscellaneous
const path = require("path");
const favicon = require('serve-favicon');
const faviconPath = path.join(__dirname, 'favicon.ico');
app.use(favicon(faviconPath));

const backendPlayers = {};
const map = new Map();

app.use(express.static(path.join(__dirname, "../client"))); // Game files from the 'client' folder
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/index.html'));
// })

io.on("connection", (socket) => {
    console.log("a user connected");
    backendPlayers[socket.id] = new Player(
        10 + 50 * Math.random(),
        50,
        50,
        65,
        1
    );

    io.emit("updatePlayers", backendPlayers);

    socket.on("disconnect", (reason) => {
        console.log(`a user disconnected with reason: ${reason}`);
        delete backendPlayers[socket.id];
        io.emit("updatePlayers", backendPlayers);
    });

    socket.on("keydown", (code) => {
        let player = backendPlayers[socket.id];
        switch (code) {
            case "KeyA":
                player.leftHeld = true;
                break;
            case "KeyD":
                player.rightHeld = true;
                break;
            case "Space":
                if (player.onPlatform) {
                    player.jumpHeld = true;
                }
                break;
        }
    });

    socket.on("keyup", (code) => {
        let player = backendPlayers[socket.id];
        switch (code) {
            case "KeyA":
                player.leftHeld = false;
                break;
            case "KeyD":
                player.rightHeld = false;
                break;
            case "Space":
                if (player.onPlatform) {
                    player.jumpHeld = false;
                    player.jump();
                }
                break;
        }
    });
});

setInterval(() => {
    for (const id in backendPlayers) {
        backendPlayers[id].update(map);
    }
    io.emit("updatePlayers", backendPlayers);
}, 15);

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
