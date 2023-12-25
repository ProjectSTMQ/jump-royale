const express = require('express')
const app = express()
const PORT = 5000

// Socket.io server uses an http server
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

const path = require('path'); // Import the 'path' module

app.use(express.static(path.join(__dirname, '../client'))); // Serve static javascript files from the 'client' folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('a user disconnected');
    })
})

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})