class Player{
    constructor(x, y, width, height){
        this.x = x
        this.y = y
        this.velocity = { x: 0, y: 0 }
        this.acceleration = { x: 0, y: 0.1 }
        this.width = width
        this.height = height
        this.jumpStrength = -5;
    }

    draw() {
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Simple ground collision (change later to lines)
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity.y = 0;
        }
    }

    jump(){
        this.velocity.y = this.jumpStrength;
    }    
}