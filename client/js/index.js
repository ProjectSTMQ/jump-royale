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

const setupLevels = true
var levelNum = 0
var levelLines = [new Line(50,900,1150,900), new Line(350,500,1150,500), new Line(50, 700, 50, 900), new Line(350, 700, 350, 900), new Line(150, 200, 150, 550)]
var logs = ''
// logs += `// LEVEL: ${this.levelNum}\n`


const levelZero = new Level(0, levelLines) // tmp
const player = new Player(50, 50, 50, 65)

// Main function continuously running
function draw(){
    ctx.clearRect(1, 1, canvas.width-2, canvas.height-2)
    
    // tmp
    levelZero.draw()
    for(let object of this.levelLines){
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
            logs += `newLevel = new Level(${this.levelNum}, this.levelLines)\n` 
            logs += 'levels.push(newLevel)'
            this.levelNum += 1
            // console.log(this.levelNum)
            break
        case 'Delete':
            this.levelLines.pop()
            break
        case 'KeyL':
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

        // this.levelLines.push(new Line(x1, y1, x2, y2))
        // logs.push(`this.levelLines.push(new Line(${x1}, ${y1}, ${x2}, ${x2}))`)
        logs += `this.levelLines.push(new Line(${x1}, ${y1}, ${x2}, ${x2}))\n`

        x1 = null
        y1 = null
        x2 = null
        y2 = null
    }
})

draw()