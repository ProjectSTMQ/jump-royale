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

const map = new Map(0)
const player = new Player(50, 50, 50, 65)

function draw(){
    ctx.clearRect(1, 1, canvas.width-2, canvas.height-2)
    map.draw()
    player.update()
    // if(map.checkCollision(player)){
    //     player.velocity.x = 0
    //     player.velocity.y = 0
    // }
    requestAnimationFrame(draw)
}

window.addEventListener('keypress', (event) => {
    switch(event.code) {
        case 'KeyW':
            player.y = player.y - 10
            break
        case 'KeyS':
            player.y = player.y + 10
            break
        case 'KeyA':
            player.x = player.x - 10
            break
        case 'KeyD':
            player.x = player.x + 10
            break
        case 'Space':
            player.jump()
            break
    }
})

draw()