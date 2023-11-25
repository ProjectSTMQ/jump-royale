const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

// Set borders
canvas.width = 1200
canvas.height = 900

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
var creatingHorizontal = false
var creatingVertical = false
var creatingDiagonal = false


const map = new Map()
var currentLevel
var currentLevelNum = 1

var backgroundImg = new Image();

const player = new Player(50, 50, 50, 65)

// Main function continuously running
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    map.checkAdvanceLevel()
    currentLevel = map.levels[currentLevelNum - 1]
    backgroundImg.src = currentLevel.image;
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    // currentLevel.draw() // show level lines

    player.update()
    requestAnimationFrame(draw)
}

function levelSetup(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    backgroundImg.src = './imgs/levels/' + this.setupLevelNum + '.png'
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    for(let object of setupLines){
        object.draw()
    }
    requestAnimationFrame(levelSetup)
}

window.addEventListener('keydown', (event) => {
    switch(event.code) {
        case 'ArrowLeft':
            player.leftHeld = true
            break
        case 'ArrowRight':
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

            console.log(logs)
            logs = ''
            setupLines = []
            this.currentLevelNum += 1
            break
        case 'KeyH':
            console.log("Creating horizontal")
            creatingHorizontal = true
            creatingVertical = false
            creatingDiagonal = false
            break
        case 'KeyV':
            console.log("Creating vertical")
            creatingVertical = true
            creatingHorizontal = false
            creatingDiagonal = false
            break
        case 'KeyD':
            console.log("Creating diagonal")
            creatingDiagonal = true
            creatingHorizontal = false
            creatingVertical = false
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
        case 'ArrowLeft':
            player.leftHeld = false
            break
        case 'ArrowRight':
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

    console.log(event.offsetX)
    console.log(event.offsetY)

    // First click
    if(x1 == null && y1 == null){
        x1 = event.offsetX
        y1 = event.offsetY
    }
    else{
        if(creatingVertical){
            console.log("adjusting to vertical")
            x2 = x1
            y2 = event.offsetY
            console.log("new x2: " + x2)
        }
        if(creatingHorizontal){
            console.log("adjusting to horizontal")
            y2 = y1
            x2 = event.offsetX
            console.log("new y2: " + y2)
        }
        
        let line = new Line(x1, y1, x2, y2)
        console.log(line)
        // TODO - better checking and line setup stuff
        if(line.isDiagonal || line.isHorizontal || line.isVertical){
            logs += `this.levelLines.push(new Line(${x1}, ${y1}, ${x2}, ${y2}))\n`
            setupLines.push(line)
        }
        else{
            console.log("INVALID LINE")
        }

        x1 = null
        y1 = null
        x2 = null
        y2 = null

        // console.log("Resetting flags")
        creatingHorizontal = false
        creatingVertical = false
        creatingDiagonal = false
    }
})

if(!setupLevels) draw()
else levelSetup()