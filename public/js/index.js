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

// Load player sprite images - TODO: image sizes are still weird, player is smaller than it should look but functionally it's fine for now
let idleImage = new Image();
idleImage.src = "./imgs/poses/idle.png";
let squatImage = new Image();
squatImage.src = "./imgs/poses/squat.png";
let jumpImage = new Image();
jumpImage.src = "./imgs/poses/jump.png";
let bounceImage = new Image();
bounceImage.src = "./imgs/poses/bounce.png";
let run1Image = new Image();
run1Image.src = "./imgs/poses/run1.png";
let run2Image = new Image();
run2Image.src = "./imgs/poses/run2.png";
let run3Image = new Image();
run3Image.src = "./imgs/poses/run3.png";
let fallenImage = new Image();
fallenImage.src = "./imgs/poses/fallen.png";
let fallImage = new Image();
fallImage.src = "./imgs/poses/fall.png";

const frontendPlayers = {};

const socket = io();

socket.on("updatePlayers", (backendPlayers) => {

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
    // this stuttering bad we need to fix this =======================================================================================================================
    draw(); // Update the frames every time the server sends an update
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //continiously draws, will run even before serverside update and in the middle of update
    //fix so that stertling stops bitching  -> async await?
    if (frontendPlayers[socket.id] && frontendPlayers[socket.id].levelImage) {
        backgroundImg.src = frontendPlayers[socket.id].levelImage;
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
        currentLevel = frontendPlayers[socket.id].levelLines;

        drawLevel(currentLevel); // Optional show level lines
    }

    for (const id in frontendPlayers) {
        if (frontendPlayers[id].levelNum == frontendPlayers[socket.id].levelNum) {
            drawPlayer(frontendPlayers[id]);
        }
    }
    
}

function drawPlayer(player) {
    console.log(player.state);

    const drawImage = (image) => {
        if (player.facingLeft) {
            ctx.save();
            ctx.scale(-1, 1); // Flip horizontally
            ctx.drawImage(image, -player.x - player.width, player.y, player.width, player.height);
            ctx.restore();
        } else {
            ctx.drawImage(image, player.x, player.y, player.width, player.height);
        }
    };

    switch (player.state) {
        case "idle":
            drawImage(idleImage);
            break;
        case "squat":
            drawImage(squatImage);
            break;
        case "jump":
            drawImage(jumpImage);
            break;
        case "bounce":
            drawImage(bounceImage);
            break;
        case "run1":
            drawImage(run1Image);
            break;
        case "run2":
            drawImage(run2Image);
            break;
        case "run3":
            drawImage(run3Image);
            break;
        case "fallen":
            drawImage(fallenImage);
            break;
        case "fall":
            drawImage(fallImage);
            break;
        default: // debug state
            ctx.fillStyle = "purple";
            ctx.fillRect(player.x, player.y, player.width, player.height);
            break;
    }

    // show true hitbox size
    ctx.strokeStyle = "purple";
    ctx.strokeRect(player.x, player.y, player.width, player.height);
}

function drawLevel(level) {
    for (line of level) {
        drawLine(line);
    }
}

function drawLine(line) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
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
