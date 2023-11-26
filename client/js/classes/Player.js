class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.velocity = { x: 0, y: 0 };
        this.onPlatform = false;

        // STILL NEEDS TUNING
        this.gravity = 0.15;
        this.maxVerticalSpeed = 20;
        this.lateralJumpingSpeed = 3;
        this.playerMovementSpeed = 2;

        this.width = width;
        this.height = height;

        this.leftHeld = false;
        this.rightHeld = false;
        this.jumpHeld = false;

        // STILL NEEDS TUNING
        this.baseJumpStrength = 2; // Minimum jump strength
        this.jumpStrength = this.baseJumpStrength; // Dynamically changes
        this.jumpIncreaseSpeed = 0.3; // Speed at which jump strength increases as you hold
        this.maxJumpStrength = 10.5; // Maximum power we can jump
        this.isJumping = false;
    }

    draw() {
        ctx.fillStyle = "purple"
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.draw();
       
        console.log(this.jumpStrength)
        let currentLines = currentLevel.lines;
        this.checkLineCollisions(currentLines);
        this.applyPlayerMovement();
        this.updateJumpStrength();
        this.applyGravity();
    }

    applyPlayerMovement() {
        if (this.rightHeld && this.onPlatform) {
            this.velocity.x = this.playerMovementSpeed;
        } else if (this.leftHeld && this.onPlatform) {
            this.velocity.x = -this.playerMovementSpeed;
        } else if (this.onPlatform) {
            this.velocity.x = 0;
        }

        if (this.isJumping && this.isMovingRight()){
            this.velocity.x = this.lateralJumpingSpeed;
        } else if (this.isJumping && this.isMovingLeft()){
            this.velocity.x = -this.lateralJumpingSpeed;
        }

        if (!this.jumpHeld) {
            this.x += this.velocity.x;
        }
    }

    isMovingLeft() {
        return this.velocity.x < 0;
    }

    isMovingRight() {
        return this.velocity.x > 0;
    }

    applyGravity() {
        if (!this.onPlatform) {
            this.y += this.velocity.y;
            this.velocity.y = Math.min(
                this.velocity.y + this.gravity,
                this.maxVerticalSpeed
            );
        } else {
            this.velocity.y = 0;
        }
    }

    checkLineCollisions(currentLines) {
        let collidedLines = [];
        let chosenLine;

        let i = 0;
        while (i < currentLines.length && collidedLines.length < 2) {
            if (this.isCollidingWithLine(currentLines[i])) {
                collidedLines.push(currentLines[i]);
            }
            i++;
        }

        if (collidedLines.length > 0) {
            if (collidedLines.length == 2) {
                var lineHoriz = collidedLines[0].isHorizontal
                    ? collidedLines[0]
                    : collidedLines[1];
                var lineVert = collidedLines[0].isVertical
                    ? collidedLines[0]
                    : collidedLines[1];


                if(this.velocity.y == 0){
                    chosenLine = lineVert
                }
                else{
                    var yCorrection = Math.min(Math.abs(this.y + this.height - lineHoriz.y1), Math.abs(this.y - lineHoriz.y1));
                    var xCorrection = Math.min(
                        Math.abs(this.x - lineVert.x1),
                        Math.abs(this.x + this.width - lineVert.x1)
                    );
    
                    chosenLine = yCorrection <= xCorrection ? lineHoriz : lineVert;
                }
              
             
            } else {
                chosenLine = collidedLines[0];
            }
           
            this.handleCollision(chosenLine);
        } else {
            this.onPlatform = false;
        }
       
    }

    handleCollision(line) {
       
        if (line.isHorizontal) {
           
            //console.log(this.velocity.y)
            if (this.velocity.y >= 0 && !this.onPlatform) {
                this.onPlatform = true;
                this.isJumping = false;
                this.y = line.y1 - this.height;
            } else if(this.velocity.y < 0){
                this.velocity.y = -this.velocity.y / 3;
                this.y = line.y1 +10;
                this.y += this.velocity.y;
            }
        } else if (line.isVertical) {
            this.x = this.velocity.x > 0 ? line.x1 - this.width : line.x1;
            this.velocity.x = -this.velocity.x;
        }
    }

    isCollidingWithLine(line) {
        var isPlayerWithinLineX;
        var isPlayerWithinLineY;

        if (line.isHorizontal) {
            isPlayerWithinLineX =
                (line.x1 < this.x && this.x < line.x2) ||
                (line.x1 < this.x + this.width &&
                    this.x + this.width < line.x2) ||
                (this.x < line.x1 && line.x1 < this.x + this.width) ||
                (this.x < line.x2 && line.x2 < this.x + this.width);

            isPlayerWithinLineY =
                this.y < line.y1 && line.y1 <= this.y + this.height;
        } else if (line.isVertical) {
            isPlayerWithinLineY =
                (line.y1 < this.y && this.y < line.y2) ||
                (line.y1 < this.y + this.height &&
                    this.y + this.height < line.y2) ||
                (this.y < line.y1 && line.y1 < this.y + this.height) ||
                (this.y < line.y2 && line.y2 < this.y + this.height);

            isPlayerWithinLineX =
                this.x < line.x1 && line.x1 < this.x + this.width;
        }

        return isPlayerWithinLineX && isPlayerWithinLineY;
    }

    updateJumpStrength() {

        if (
            
            this.onPlatform &&
            this.jumpHeld &&
            this.jumpStrength < this.maxJumpStrength
        ) {
            console.log("jump")
            this.jumpStrength = Math.min(
                this.jumpStrength + this.jumpIncreaseSpeed,
                this.maxJumpStrength
            );
        }
    }

    jump() {
        this.velocity.y = -this.jumpStrength;
        this.jumpStrength = this.baseJumpStrength;
        this.y += this.velocity.y;
        this.onPlatform = false;
        this.isJumping = true;
    }
}
