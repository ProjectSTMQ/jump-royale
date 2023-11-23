class Player{
    constructor(x, y, width, height){
        this.x = x
        this.y = y
        this.onPlatform = false

        this.velocity = { x: 0, y: 0 }

        this.gravity = 0.1
        this.maxVerticalSpeed = 20

        this.width = width
        this.height = height

        this.leftHeld = false
        this.rightHeld = false

        this.playerMovementSpeed = 2
        this.jumpStrength = -5;
    }

    draw() {
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }

    update(){
        this.draw()
        let currentLines = levelZero.lines
        this.checkLineCollisions(currentLines)

        this.applyPlayerMovement()
        this.applyGravity()
    }

    applyPlayerMovement(){
        if(this.rightHeld && this.onPlatform){
            this.x += this.playerMovementSpeed
        }
        else if(this.leftHeld && this.onPlatform){
            this.x += -this.playerMovementSpeed
        }
        else{
            this.x += this.velocity.x;
        }
    }

    applyGravity(){
      
        if(!this.onPlatform){
            this.y += this.velocity.y;
            this.velocity.y = Math.min(this.velocity.y + this.gravity, this.maxVerticalSpeed)
        }
        // console.log(this.velocity.y)
    }


    checkLineCollisions(currentLines){
        let collidedLines = []
        for(let i = 0; i < currentLines.length; i++){
            if(this.isCollidingWithLine(currentLines[i])) collidedLines.push(currentLines[i])
        }       

        // ????
        for(let i = 0; i < collidedLines.length; i++){
            if(collidedLines[i].isHorizontal){
                if( this.y < collidedLines[i].y1 && collidedLines[i].y1 < this.y + this.height){
                    this.onPlatform = true
                    this.y = collidedLines[i].y1 - this.height
                }
                else{
                    this.onPlatform = false
                    this.velocity.y = 0
                    this.velocity.x = 0
                }
            }
            else if(collidedLines[i].isVertical){
                this.onPlatform = true
                this.y = collidedLines[i].y1 - this.height
            }
        }     
    }

    isCollidingWithLine(line){
      
        var isPlayerWithinLineX
        var isPlayerWithinLineY 
        if (line.isHorizontal) {
            isPlayerWithinLineX = (line.x1 < this.x && this.x < line.x2) || (line.x1 < this.x + this.width && this.x + this.width < line.x2) || (this.x < line.x1 && line.x1 < this.x + this.width) || (this.x < line.x2 && line.x2 < this.x + this.width);
            isPlayerWithinLineY = this.y < line.y1 && line.y1 < this.y + this.height;

            return isPlayerWithinLineX && isPlayerWithinLineY;

        }
        else if (line.isVertical) {
            
            isPlayerWithinLineY = (line.y1 < this.y && this.y < line.y2) || (line.y1 < this.y + this.height && this.y + this.height < line.y2) || (this.y < line.y1 && line.y1 < this.y + this.height) || (this.y < line.y2 && line.y2 < this.y + this.height);
            isPlayerWithinLineX = this.x < line.x1 && line.x1 < this.x + this.width;

            return isPlayerWithinLineX && isPlayerWithinLineY;
        }

        return false
    }

    jump(){
        this.velocity.y = this.jumpStrength;
        this.onPlatform = false;
    }
}