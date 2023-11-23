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
        if(this.rightHeld){
            this.x += this.playerMovementSpeed
        }
        else if(this.leftHeld){
            this.x += -this.playerMovementSpeed
        }
        else{
            this.x += this.velocity.x;
        }
    }

    applyGravity(){
        this.y += this.velocity.y;
        if(!this.onPlatform){
            this.velocity.y = Math.min(this.velocity.y + this.gravity, this.maxVerticalSpeed)
        }
        // console.log(this.velocity.y)
    }


    checkLineCollisions(currentLines){
        let collidedLines = []
        for(let i = 0; i < currentLines.length; i++){
            if(this.isCollidingWithLine(currentLines[i])) collidedLines.push(currentLines[i])
        }
    }

    isCollidingWithLine(l){
        if (l.isHorizontal) {
            var isPlayerWithinLineX = (l.x1 < this.x && this.x < l.x2) || (l.x1 < this.x + this.width && this.x + this.width < l.x2) || (this.x < l.x1 && l.x1 < this.x + this.width) || (this.x < l.x2 && l.x2 < this.x + this.width);
            var isPlayerWithinLineY = this.y < l.y1 && l.y1 < this.y + this.height;

            // prob move this
            if(isPlayerWithinLineX && isPlayerWithinLineY){
                // this.onPlatform = true
                this.y = l.y1 - this.height
            }
            return isPlayerWithinLineX && isPlayerWithinLineY;

        }
        else if (l.isVertical) {
            isPlayerWithinLineY = (l.y1 < this.y && this.y < l.y2) || (l.y1 < this.y + this.height && this.y + this.height < l.y2) || (this.y < l.y1 && l.y1 < this.y + this.height) || (this.y < l.y2 && l.y2 < this.y + this.height);
            isPlayerWithinLineX = this.x < l.x1 && l.x1 < this.x + this.width;

            return isPlayerWithinLineX && isPlayerWithinLineY;
        }


        return false
    }

    jump(){
        this.velocity.y = this.jumpStrength;
        this.onPlatform = false;
    }
}