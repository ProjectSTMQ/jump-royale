class Player{
    constructor(x, y, width, height){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    draw() {
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
}