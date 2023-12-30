const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set borders
canvas.width = 1200; //map.canvasWidth;
canvas.height = 900; //map.canvasHeight;

// Centre canvas
canvas.style.display = "block";
canvas.style.margin = "auto";
canvas.style.position = "absolute";
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.left = 0;
canvas.style.right = 0;

let currentLevel;
let currentLevelNum = 1;

let backgroundImg = new Image();

let updated = false;

const frontendPlayers = {};

const socket = io();
socket.on("updatePlayers", (backendPlayers) => {
    updated = true;
    for (const id in backendPlayers) {
        backendPlayer = backendPlayers[id];

        frontendPlayers[id] = backendPlayer;
    }

    // If player on the frontend does not exist on the backend - ie player has disconnected
    for (const id in frontendPlayers) {
        if (!backendPlayers[id]) {
            delete frontendPlayers[id];
        }
    }

    draw(); // Update the frames every time the server sends an update
});

// Main function continuously running
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (updated) {
        //continiously draws, will run even before serverside update and in the middle of update
        //fix so that stertling stops bitching  -> async await?
        if (
            frontendPlayers[socket.id] &&
            frontendPlayers[socket.id].levelImage
        ) {
            backgroundImg.src = frontendPlayers[socket.id].levelImage;
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
            currentLevel = frontendPlayers[socket.id].levelLines;

            for (line of currentLevel) {
                ctx.strokeStyle = "red";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(line.x1, line.y1);
                ctx.lineTo(line.x2, line.y2);
                ctx.stroke();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "black";
            }
        }

        ctx.fillStyle = "purple";
        for (const id in frontendPlayers) {
            if (
                frontendPlayers[id].levelNum ==
                frontendPlayers[socket.id].levelNum
            ) {
                ctx.fillRect(
                    frontendPlayers[id].x,
                    frontendPlayers[id].y,
                    frontendPlayers[id].width,
                    frontendPlayers[id].height
                );
            }
        }
    }
}

window.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "KeyA":
            socket.emit("keydown", "KeyA");
            break;
        case "KeyD":
            socket.emit("keydown", "KeyD");
            break;
        case "Space":
            socket.emit("keydown", "Space");
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.code) {
        case "KeyA":
            socket.emit("keyup", "KeyA");
            break;
        case "KeyD":
            socket.emit("keyup", "KeyD");
            break;
        case "Space":
            socket.emit("keyup", "Space");
            break;
    }
});
