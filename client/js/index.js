const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

// Set borders
canvas.width = 1200
canvas.height = 950
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
var levelNum = 0
var logs = ''


const map = new Map()
const levelZero = map.getLevels()[0] // tmp

const player = new Player(50, 50, 50, 65)

// Main function continuously running
function draw(){
    ctx.clearRect(1, 1, canvas.width-2, canvas.height-2)
    
    if(setupLevels){
        for(let object of setupLines){
            object.draw()
        }
    }

    // tmp
    levelZero.draw()
    for(let object of levelZero.lines){
        object.draw()
    }

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
            logs += `this.newLevel = new Level(${this.levelNum}, this.levelLines)\n` 
            logs += 'this.levels.push(this.newLevel)\n'
            logs += 'this.levelLines = []\n'
            this.levelNum += 1
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

    let snappedX = event.offsetX //- event.offsetX % 20;
    let snappedY = event.offsetY //- event.offsetY % 20;

    // First click
    if(x1 == null && y1 == null){
        x1 = snappedX
        y1 = snappedY
    }
    else{
        x2 = snappedX
        y2 = snappedY

        logs += `this.levelLines.push(new Line(${x1}, ${y1}, ${x2}, ${y2}))\n`
        setupLines.push(new Line(x1, y1, x2, y2))

        x1 = null
        y1 = null
        x2 = null
        y2 = null
    }
})

draw()