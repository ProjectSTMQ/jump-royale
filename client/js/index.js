const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

// Set borders
canvas.width = 1200
canvas.height = 900
ctx.strokeRect(0, 0, canvas.width, canvas.height);

// Centre canvas
canvas.style.display = "block";
canvas.style.margin = "auto";
canvas.style.position = "absolute";
canvas.style.top = 0;
canvas.style.bottom = 0;
canvas.style.left = 0;
canvas.style.right = 0;

// For level setup
const setupLevels = false
var setupLines = [] // For visualizaion purposes when clicking
var setupLevelNum = 1
var logs = ''


const map = new Map()
var currentLevel
var currentLevelNum = 1

// tmp
var backgroundImg = new Image();

const player = new Player(50, 50, 50, 65)

// Main function continuously running
function draw(){
    ctx.clearRect(1, 1, canvas.width-2, canvas.height-2)

    map.checkAdvanceLevel()
    currentLevel = map.levels[currentLevelNum - 1]
    backgroundImg.src = currentLevel.image;
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    
    if(setupLevels){
        for(let object of setupLines){
            object.draw()
        }
    }

    // tmp to draw level lines, not actually necessary later
    currentLevel.draw()

    player.update()
    requestAnimationFrame(draw)
}

window.addEventListener('keydown', (event) => {
    switch(event.code) {
        case 'KeyA':
            player.leftHeld = true
            break
        case 'KeyD':
            player.rightHeld = true
            break
        case 'Space':
            player.jumpHeld = true
            break

        // stuff for setting up levels
        case 'KeyN':
            // Always have these 2 border lines on the sides
            logs += `this.levelLines.push(new Line(0, 0, 0, ${canvas.height}))\n`
            logs += `this.levelLines.push(new Line(${canvas.width}, 0, ${canvas.width}, ${canvas.height}))\n`

            logs += `this.newLevel = new Level(${this.setupLevelNum}, this.levelLines, './imgs/levels/${this.setupLevelNum}.png')\n` 
            logs += 'this.levels.push(this.newLevel)\n'
            logs += 'this.levelLines = []\n'
            this.setupLevelNum += 1

            setupLines = []
            this.currentLevelNum += 1
            break
        case 'Delete':
            // todo?
            // this.levelLines.pop()
            break
        case 'KeyL':
            // copy this log value from console ("Copy Object") and paste into Map.js createLevels()
            console.log(logs)
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.code) {
        case 'KeyA':
            player.leftHeld = false
            break
        case 'KeyD':
            player.rightHeld = false
            break
        case 'Space':
            player.jumpHeld = false
            player.jump()
            break
    }
})


let x1 = null
let y1 = null
let x2 = null
let y2 = null
// For level setup
window.addEventListener('click', (event) => {
    if(!setupLevels) return

    let snappedX = event.offsetX - event.offsetX % 20;
    let snappedY = event.offsetY - event.offsetY % 20;

    // First click
    if(x1 == null && y1 == null){
        x1 = snappedX
        y1 = snappedY
    }
    else{
        x2 = snappedX
        y2 = snappedY

        let line = new Line(x1, y1, x2, y2)
        // TODO - better checking and line setup stuff
        if(line.isDiagonal || line.isHorizontal || line.isVertical){
            logs += `this.levelLines.push(new Line(${x1}, ${y1}, ${x2}, ${y2}))\n`
            setupLines.push(line)

            x1 = null
            y1 = null
            x2 = null
            y2 = null
        }
        else{
            console.log("INVALID LINE")
        }
    }
})

draw()