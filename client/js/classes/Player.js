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

        // Simple ground collision (change later to lines)
        // if (this.y + this.height > canvas.height) {
        //     this.y = canvas.height - this.height;
        // }
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
            if(this.isCollidingWithLine(currentLines[i])) collidedLines.push(currentLines[i])
        }
        if(collidedLines.length == 0){
            this.onPlatform = false
        }
        console.log(collidedLines.length +"," + this.onPlatform +"," + this.velocity.y )
       
        // if(collidedLines.length != 0)console.log(collidedLines)
        // for(let i = 0; i < collidedLines.length; i++){
        //     if(collidedLines[i].isVertical) console.log(collidedLines[i])
        // }
    }

    isCollidingWithLine(line){
      
        var isPlayerWithinLineX
        var isPlayerWithinLineY 
        if (line.isHorizontal) {
            isPlayerWithinLineX = (line.x1 < this.x && this.x < line.x2) || (line.x1 < this.x + this.width && this.x + this.width < line.x2) 
            || (this.x < line.x1 && line.x1 < this.x + this.width) || (this.x < line.x2 && line.x2 < this.x + this.width);
            isPlayerWithinLineY = this.y < line.y1 && line.y1 < this.y + this.height;

            if(isPlayerWithinLineX && isPlayerWithinLineY && !this.onPlatform){
                  
                    this.onPlatform = true
                  
                    this.y = line.y1 - this.height
                
             
                // console.log("hor")
               
            }
          
            return isPlayerWithinLineX && isPlayerWithinLineY;

        }
        else if (line.isVertical) {
            
            isPlayerWithinLineY = (line.y1 < this.y && this.y < line.y2) || (line.y1 < this.y + this.height && this.y + this.height < line.y2) 
            || (this.y < line.y1 && line.y1 < this.y + this.height) || (this.y < line.y2 && line.y2 < this.y + this.height);
            
            isPlayerWithinLineX = this.x < line.x1 && line.x1 < this.x + this.width;

            
  
            if(isPlayerWithinLineX && isPlayerWithinLineY ) {
                if( this.y < line.y1 && line.y1 < this.y + this.height  && !this.onPlatform){
                    this.onPlatform = true
                    this.y = line.y1 - this.height
                
                    console.log("dab")
                }
             
              
            }

            return isPlayerWithinLineX && isPlayerWithinLineY;
        }

       
        console.log("Dab"+this.onPlatform)
        return false
    }

    jump(){
        this.velocity.y = this.jumpStrength;
        this.y += this.velocity.y
        this.onPlatform = false;
    }
}