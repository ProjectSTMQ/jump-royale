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
        this.jumpHeld = false
        this.jumpStrength = 5
        this.maxJumpStrength = 10

        // this.isJumping = false

        this.playerMovementSpeed = 2
    }

    draw() {
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }

    update(){
        this.draw()
        let currentLines = levelZero.lines
        this.checkLineCollisions(currentLines)

        
        this.applyPlayerMovement()
        this.updateJumpStrength()        
        this.applyGravity()

        // Simple ground collision (change later to lines)
        // if (this.y + this.height > canvas.height) {
        //     this.y = canvas.height - this.height;
        // }
    }

    applyPlayerMovement(){
        if(this.rightHeld){
            this.velocity.x = this.playerMovementSpeed
        }
        else if(this.leftHeld){
            this.velocity.x = -this.playerMovementSpeed
        }
        else if(this.onPlatform){
            this.velocity.x =0;
        }

        if(!this.jumpHeld){
            this.x += this.velocity.x;
        }
       
    }

    applyGravity(){
        
        
        if(!this.onPlatform){
            this.y += this.velocity.y;
            this.velocity.y = Math.min(this.velocity.y + this.gravity, this.maxVerticalSpeed)
        }
        else{
            this.velocity.y = 0
        }
      

     
        // console.log(this.velocity.y)
    }


    checkLineCollisions(currentLines){
        let collidedLines = []
        for(let i = 0; i < currentLines.length; i++){
            if(this.isCollidingWithLine(currentLines[i])) {
                this.handleCollision(currentLines[i])
                collidedLines.push(currentLines[i])
            }
        }
        if(collidedLines.length == 0){
            this.onPlatform = false
        }
       // console.log(collidedLines.length +"," + this.onPlatform +"," + this.velocity.y )
       
        // if(collidedLines.length != 0)console.log(collidedLines)
        // for(let i = 0; i < collidedLines.length; i++){
        //     if(collidedLines[i].isVertical) console.log(collidedLines[i])
        // }
    }

    handleCollision(line){

        if(line.isHorizontal){
            console.log("horiz")
            if((this.velocity.y > 0) && !this.onPlatform){
                
                this.onPlatform = true
        
                this.y = line.y1 - this.height

            }
            else{
                
                this.velocity.y = -this.velocity.y /3
                this.y = line.y1        
                this.y += this.velocity.y
            }
        }
        else if(line.isVertical){
          

            if(this.velocity.x > 0){
                console.log("fuck2")
                this.x = line.x1 - this.width
           
            }
            else{
                this.x = line.x1
            }


            this.velocity.x = -this.velocity.x
            
        }
    }

    isCollidingWithLine(line){
      
        var isPlayerWithinLineX
        var isPlayerWithinLineY 

        if (line.isHorizontal) {
            
            isPlayerWithinLineX = (line.x1 < this.x && this.x < line.x2) || (line.x1 < this.x + this.width && this.x + this.width < line.x2) 
            || (this.x < line.x1 && line.x1 < this.x + this.width) || (this.x < line.x2 && line.x2 < this.x + this.width);
            
            isPlayerWithinLineY = this.y < line.y1 && line.y1 < this.y + this.height;

           

        }
        else if (line.isVertical) {
            
            isPlayerWithinLineY = (line.y1 < this.y && this.y < line.y2) || (line.y1 < this.y + this.height && this.y + this.height < line.y2) 
            || (this.y < line.y1 && line.y1 < this.y + this.height) || (this.y < line.y2 && line.y2 < this.y + this.height);
            
            isPlayerWithinLineX = this.x < line.x1 && line.x1 < this.x + this.width;

        }

       
        return isPlayerWithinLineX && isPlayerWithinLineY;
    }

    updateJumpStrength(){
      

        if(this.onPlatform && this.jumpHeld && this.jumpStrength < this.maxJumpStrength){
            this.jumpStrength = Math.min(this.jumpStrength + 0.1, this.maxJumpStrength)
            
        }

    }

    jump(){
        this.velocity.y = -this.jumpStrength;
        this.jumpStrength = 5
        this.y += this.velocity.y
        this.onPlatform = false;
    }
}