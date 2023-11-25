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
var tmp_logs = [] // To store a list version of the strings pushed to logs: used for deleting lines
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

// debug stuff for setting up levels
if(setupLevels){
    window.addEventListener('keydown', (event) => {
        switch(event.code){

            // Go to next level to start making lines
            case 'KeyN':
                // Always have these 2 border lines on the sides
                logs += `this.levelLines.push(new Line(0, 0, 0, ${canvas.height}))\n`
                logs += `this.levelLines.push(new Line(${canvas.width}, 0, ${canvas.width}, ${canvas.height}))\n`

                logs += `this.newLevel = new Level(${this.setupLevelNum}, this.levelLines, './imgs/levels/${this.setupLevelNum}.png')\n` 
                logs += 'this.levels.push(this.newLevel)\n'
                logs += 'this.levelLines = []\n'
                this.setupLevelNum += 1

                console.log(logs) // !!!!! copy this log value from console ("Copy Object") and paste into Map.js createLevels() !!!!!

                // Clear so we can do one level at a time
                logs = ''
                setupLines = []
                tmp_logs = []
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
                logs = logs.replace(tmp_logs.pop(), '')
                setupLines.pop()
                break
            case 'KeyL':
                // debug to check what lines have been pushed to the log
                console.log("Number of lines: " + setupLines.length)
                console.log(logs)
                break
        }
    })

    function getQuadrant(origin_x1, origin_y1, x1, y1){
        if(x1 > origin_x1 && y1 < origin_y1) return 1
        if(x1 < origin_x1 && y1 < origin_y1) return 2
        if(x1 < origin_x1 && y1 > origin_y1) return 3
        if(x1 > origin_x1 && y1 > origin_y1) return 4
        else return 0
    }

    let x1 = null
    let y1 = null
    let x2 = null
    let y2 = null
    window.addEventListener('click', (event) => {
        // First click
        if(x1 == null && y1 == null){
            x1 = event.offsetX
            y1 = event.offsetY
        }
        else{
            if(creatingVertical){
                x2 = x1
                y2 = event.offsetY
            }
            if(creatingHorizontal){
                y2 = y1
                x2 = event.offsetX
            }
            if(creatingDiagonal){
                x2 = event.offsetX
                y2 = event.offsetY
                let q = getQuadrant(x1, y1, x2, y2)

                // let's just say always use the x coordinate and adjust y coordinate accordingly so it's a valid diagonal line
                switch(q){
                    case 0:
                        console.log("wyd here you clicked the same point bro")
                        break
                    // adjust y +- depending on the quadrant
                    case 1:
                    case 2:
                        y2 = y1 - Math.abs(x1 - x2)
                        break
                    case 3:
                    case 4:
                        y2 = y1 + Math.abs(x1 - x2)
                        break
                }
            }
            
            let line = new Line(x1, y1, x2, y2)
            console.log(line)
            // TODO - better checking and line setup stuff
            if(line.isDiagonal || line.isHorizontal || line.isVertical){
                logs += `this.levelLines.push(new Line(${x1}, ${y1}, ${x2}, ${y2}))\n`
                tmp_logs.push(`this.levelLines.push(new Line(${x1}, ${y1}, ${x2}, ${y2}))\n`)
                setupLines.push(line)
            }
            else{
                console.log("INVALID LINE")
            }

            x1 = null
            y1 = null
            x2 = null
            y2 = null

            creatingHorizontal = false
            creatingVertical = false
            creatingDiagonal = false
        }
    })
}

if(setupLevels) levelSetup()
else draw()