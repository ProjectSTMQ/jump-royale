const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set borders


canvas.width =  1200//map.canvasWidth;
canvas.height = 900//map.canvasHeight;

// Centre canvas
canvas.style.display = "block";
canvas.style.margin = "auto";
canvas.style.position = "absolute";
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.left = 0;
canvas.style.right = 0;

// For level setup
const setupLevels = false;
var setupLines = []; // For visualizaion purposes when clicking
var setupLevelNum = 1;
var logs = "";
var tmp_logs = []; // To store a list version of the strings pushed to logs: used for deleting lines
var creatingHorizontal = false;
var creatingVertical = false;
var creatingDiagonal = false;


var currentLevel;
var currentLevelNum = 1;

var backgroundImg = new Image();

var updated = false;

const frontendPlayers = {};

const socket = io();
socket.on('updatePlayers', (backendPlayers) => {

    updated = true;
    for(const id in backendPlayers){
        backendPlayer = backendPlayers[id];
        
        frontendPlayers[id] = backendPlayer;
     
    }

    // If player on the frontend does not exist on the backend - ie player has disconnected
    for(const id in frontendPlayers){
        if(!backendPlayers[id]){
            delete frontendPlayers[id];
        }
    }

    // console.log(frontendPlayers);
});


// const player = new Player(50, 50, 50, 65);

// Main function continuously running
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // map.checkAdvanceLevel();
    
    //Object.keys(frontendPlayers).length
    if( updated){
        //continiously draws, will run even before serverside update and in the middle of update
        //fix so that stertling stops bitching  -> async await?
        //if(frontendPlayers[socket.id] && frontendPlayers[socket.id].levelImage){
            backgroundImg.src = frontendPlayers[socket.id].levelImage; 
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
            currentLevel = frontendPlayers[socket.id].levelLines; 
           
          
            //currentLevel.draw() // optional show level lines
            for ( line of currentLevel) {
             
                ctx.strokeStyle = "red";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(line.x1, line.y1);
                ctx.lineTo(line.x2, line.y2);
                ctx.stroke();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "black";
            }
        //}
       
        ctx.fillStyle = "purple"
        // player.update();
        for(const id in frontendPlayers){
            // if(frontendPlayers[id] instanceof Player){
            if(frontendPlayers[id].levelNum == frontendPlayers[socket.id].levelNum){
                ctx.fillRect( frontendPlayers[id].x,  frontendPlayers[id].y,  frontendPlayers[id].width,  frontendPlayers[id].height);
            }
        
            // }
        }
       
    }
    requestAnimationFrame(draw);
    
}

function levelSetup() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    backgroundImg.src = "./imgs/levels/" + this.setupLevelNum + ".png";
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    for (let object of setupLines) {
        object.draw();
    }
    requestAnimationFrame(levelSetup);
}

window.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "KeyA":
            // player.leftHeld = true;
            socket.emit('keydown', 'KeyA');
            break;
        case "KeyD":
            // player.rightHeld = true;
            socket.emit('keydown', 'KeyD');
            break;
        case "Space":
            socket.emit('keydown', 'Space');
            // if(player.onPlatform){
            //     player.jumpHeld = true;
            // }
           
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.code) {
        case "KeyA":
            // player.leftHeld = false;
            socket.emit('keyup', 'KeyA');
            break;
        case "KeyD":
            socket.emit('keyup', 'KeyD');
            // player.rightHeld = false;
            break;
        case "Space":
            socket.emit('keyup', 'Space');
            // if(player.onPlatform){
            // player.jumpHeld = false;
            
            // player.jump();
            break;
    }
});

// debug stuff for setting up levels
if (setupLevels) {
    window.addEventListener("keydown", (event) => {
        switch (event.code) {
            // Go to next level to start making lines
            case "KeyN":
                // Always have these 2 border lines on the sides
                logs += `this.levelLines.push(new Line(0, 0, 0, ${canvas.height}))\n`;
                logs += `this.levelLines.push(new Line(${canvas.width}, 0, ${canvas.width}, ${canvas.height}))\n`;

                logs += `this.newLevel = new Level(${this.setupLevelNum}, this.levelLines, './imgs/levels/${this.setupLevelNum}.png')\n`;
                logs += "this.levels.push(this.newLevel)\n";
                logs += "this.levelLines = []\n";
                this.setupLevelNum += 1;

                console.log(logs); // !!!!! copy this log value from console ("Copy Object") and paste into Map.js createLevels() !!!!!

                // Clear so we can do one level at a time
                logs = "";
                setupLines = [];
                tmp_logs = [];
                this.currentLevelNum += 1;
                break;
            case "KeyH":
                console.log("Creating horizontal");
                creatingHorizontal = true;
                creatingVertical = false;
                creatingDiagonal = false;
                break;
            case "KeyV":
                console.log("Creating vertical");
                creatingVertical = true;
                creatingHorizontal = false;
                creatingDiagonal = false;
                break;
            case "KeyF":
                console.log("Creating diagonal");
                creatingDiagonal = true;
                creatingHorizontal = false;
                creatingVertical = false;
                break;
            case "Delete":
                logs = logs.replace(tmp_logs.pop(), "");
                setupLines.pop();
                break;
            case "KeyL":
                // debug to check what lines have been pushed to the log
                console.log("Number of lines: " + setupLines.length);
                console.log(logs);
                break;
        }
    });

    function getQuadrant(origin_x1, origin_y1, x1, y1) {
        if (x1 > origin_x1 && y1 < origin_y1) return 1;
        if (x1 < origin_x1 && y1 < origin_y1) return 2;
        if (x1 < origin_x1 && y1 > origin_y1) return 3;
        if (x1 > origin_x1 && y1 > origin_y1) return 4;
        else return 0;
    }

    let x1 = null;
    let y1 = null;
    let x2 = null;
    let y2 = null;
    window.addEventListener("click", (event) => {
        // First click
        if (x1 == null && y1 == null) {
            x1 = event.offsetX;
            y1 = event.offsetY;
        } else {
            if (creatingVertical) {
                x2 = x1;
                y2 = event.offsetY;
            }
            if (creatingHorizontal) {
                y2 = y1;
                x2 = event.offsetX;
            }
            if (creatingDiagonal) {
                x2 = event.offsetX;
                y2 = event.offsetY;
                let q = getQuadrant(x1, y1, x2, y2);

                // let's just say always use the x coordinate and adjust y coordinate accordingly so it's a valid diagonal line
                switch (q) {
                    case 0:
                        console.log("wyd here you clicked the same point bro");
                        break;
                    // adjust y +- depending on the quadrant
                    case 1:
                    case 2:
                        y2 = y1 - Math.abs(x1 - x2);
                        break;
                    case 3:
                    case 4:
                        y2 = y1 + Math.abs(x1 - x2);
                        break;
                }
            }

            let line = new Line(x1, y1, x2, y2);
            console.log(line);
            // TODO - better checking and line setup stuff
            if (line.isDiagonal || line.isHorizontal || line.isVertical) {
                logs += `this.levelLines.push(new Line(${x1}, ${y1}, ${x2}, ${y2}))\n`;
                tmp_logs.push(
                    `this.levelLines.push(new Line(${x1}, ${y1}, ${x2}, ${y2}))\n`
                );
                setupLines.push(line);
            } else {
                console.log("INVALID LINE");
            }

            x1 = null;
            y1 = null;
            x2 = null;
            y2 = null;

            creatingHorizontal = false;
            creatingVertical = false;
            creatingDiagonal = false;
        }
    });
}

if (setupLevels) levelSetup();
else draw();
