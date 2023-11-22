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


const player = new Player(50, 50, 50, 65)
player.draw()
console.log(player)

console.log(canvas)
console.log(ctx)