class Player{
    constructor(x, y, width, height){
        this.x = x
        this.y = y
        this.onPlatform = false

        this.velocity = { x: 0, y: 0 }
        this.acceleration = { x: 0, y: 0.1 }

        this.width = width
        this.height = height

        this.leftHeld = false
        this.rightHeld = false

        this.horizontalSpeed = 2
        this.jumpStrength = -5;
    }

    draw() {
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.velocity.x += this.acceleration.x;
        if(!this.onPlatform){
            this.velocity.y += this.acceleration.y;
            this.y += this.velocity.y;
        }
   

        if(this.rightHeld){
            this.x += this.horizontalSpeed
        }
        else if(this.leftHeld){
            this.x += -this.horizontalSpeed
        }
        else{
            this.x += this.velocity.x;
        }
     

        // Simple ground collision (change later to lines)
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
        
        }
      
    }

    jump(){
        this.velocity.y = this.jumpStrength;
        this.onPlatform = false;
    }    
}