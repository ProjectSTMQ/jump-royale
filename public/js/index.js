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

// Load player sounds
let bounceSound = new Audio("./sounds/bounce.mp3");
let fallSound = new Audio("./sounds/fall.mp3");
let jumpSound = new Audio("./sounds/jump.mp3");
let landSound = new Audio("./sounds/land.mp3");

let usernameSubmitted = false;

const frontendPlayers = {};
const frontendMap = new Map();

const keys = {
    "KeyA": {
        "pressed" : false,
    },
    "KeyD": {
        "pressed" : false,
    },
    "Space": {
        "pressed" : false,
        "previouslyPressed" : false
    }
};

const socket = io();

const username = null;

socket.on("connect", () => {
    console.log("Connected to server");
    draw();
});

socket.on("updateMap", (backendMap) => {
    this.frontendMap = backendMap;
});

socket.on("updatePlayers", (backendPlayers) => {
    for (const id in backendPlayers) {
        frontendPlayers[id] = backendPlayers[id];
    }

    // If player on the frontend does not exist on the backend - ie player has disconnected
    for (const id in frontendPlayers) {
        if (!backendPlayers[id]) {
            delete frontendPlayers[id];
        }
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(frontendPlayers[socket.id]){
        let player = castToPlayer(frontendPlayers[socket.id]);

        player.update(this.frontendMap);
        frontendPlayers[socket.id] = player;

        backgroundImg.src = player.levelImage;
        currentLevel = player.levelLines;
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

        // drawLevel(currentLevel); // Optional show level lines

        for (const id in frontendPlayers) {
            if (frontendPlayers[id].levelNum == player.levelNum && frontendPlayers[id].username != null) {
                drawPlayer(frontendPlayers[id]);
            }
        }
    }
    requestAnimationFrame(draw);
}

function drawPlayer(player) {
    // console.log("state: " + player.state + " | previous state: " + player.previousState);
    
    function drawUsername(text, x, y, width) {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.font = "20px Arial";
        const textWidth = ctx.measureText(text).width;
        const textX = x + (width - textWidth) / 2;
        ctx.strokeText(text, textX, y);
        ctx.fillText(text, textX, y);
        ctx.lineWidth = 1;
    }

    if (player.username) drawUsername(player.username, player.x, player.y - 10, player.width);

    const drawImage = (image) => {
        // To better match the size of the original game
        const sizeMultiplier = 1.5;
        const yOffset = 30;
        const xOffset = 10;

        if (player.facingLeft) {
            ctx.save();
            ctx.scale(-1, 1); // Flip horizontally
            ctx.drawImage(image, -player.x - player.width - xOffset, player.y - yOffset, player.width * sizeMultiplier, player.height * sizeMultiplier);
            ctx.restore();
        } else {
            ctx.drawImage(image, player.x - xOffset, player.y - yOffset, player.width * sizeMultiplier, player.height * sizeMultiplier);
        }
    };

    switch (player.state) {
        case "idle":
            drawImage(idleImage);
            if(["fall", "bounce"].includes(player.previousState)) landSound.play();
            break;
        case "squat":
            drawImage(squatImage);
            break;
        case "jump":
            drawImage(jumpImage);
            if(["squat"].includes(player.previousState)) jumpSound.play();
            break;
        case "bounce":
            drawImage(bounceImage);
            if(["jump", "fall"].includes(player.previousState)) bounceSound.play();
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
    // ctx.strokeStyle = "purple";
    // ctx.strokeRect(player.x, player.y, player.width, player.height);
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

// Objects sent through socket.io are serialized to json and don't retain object type or functions - https://stackoverflow.com/a/30551386
function castToPlayer(obj) {
    return Object.assign(new Player(), obj)
}

setInterval(() => {
    let player = castToPlayer(frontendPlayers[socket.id]);

    if(keys.KeyA.pressed) {
        player.leftHeld = true;
        socket.emit("keydown", "KeyA");
    }
    else{
        player.leftHeld = false;
        socket.emit("keyup", "KeyA");
    }

    if(keys.KeyD.pressed) {
        player.rightHeld = true;
        socket.emit("keydown", "KeyD");
    }
    else{
        player.rightHeld = false;
        socket.emit("keyup", "KeyD");
    }


    if(keys.Space.pressed) {
        if (player.onPlatform) {
            player.jumpHeld = true;
        }
        socket.emit("keydown", "Space");
    }
    else{
        if(keys.Space.previouslyPressed){
            keys.Space.previouslyPressed = false;
            if (player.onPlatform) {
                player.jumpHeld = false;
                player.jump();
            }
            socket.emit("keyup", "Space");
        }
    }

    frontendPlayers[socket.id] = player;
}, 15);

window.addEventListener("keydown", (event) => {
    if (!this.usernameSubmitted) return; // Don't allow player to move until they've submitted a username - kinda janky since it's on frontend but it works i guess
    switch (event.code) {
        case "KeyA":
            keys.KeyA.pressed = true;
            break;
        case "KeyD":
            keys.KeyD.pressed = true;
            break;
        case "Space":
            keys.Space.pressed = true;
            keys.Space.previouslyPressed = true;
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.code) {
        case "KeyA":
            keys.KeyA.pressed = false;
            break;
        case "KeyD":
            keys.KeyD.pressed = false;
            break;
        case "Space":
            keys.Space.pressed = false;
            break;
    }
});

document.querySelector("#usernameForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent page refresh
    const username = document.querySelector("#usernameInput").value;
   
    if (username) {
<<<<<<< HEAD

        document.querySelector("#usernameDiv").classList.add("fade-out-usernameDiv");
        //document.querySelector("#usernameDiv").classList.toggle("disabled");
       // document.querySelector("#usernameForm").style.display = "none";
=======
        document.querySelector("#usernameDiv").classList.toggle("fade-out");
>>>>>>> 35a3259f74d4141da2fb1da645d3fcd92ce8ef51
        this.usernameSubmitted = true;
        socket.emit("username", username);
    }
});