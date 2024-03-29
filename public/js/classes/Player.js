const initX = 580;
const initY = 755;
const initLevelNum = 1;

class Player {
    constructor() {
        this.username = null;

        // Spatial properties
        this.width = 50;
        this.height = 65;
        this.x = initX;
        this.y = initY;
        this.velocity = { x: 0, y: 0 };

        // Level properties
        this.levelNum = initLevelNum;
        this.levelImage = null;
        this.levelLines = {};

        // Static properties
        this.gravity = 0.55;
        this.maxVerticalSpeed = 20;
        this.lateralJumpingSpeed = 8.5;
        this.playerMovementSpeed = 5;
        this.diagonalSlideSpeed = 3;
        // STILL NEEDS TUNING
        this.baseJumpStrength = 2; // Minimum jump strength
        this.jumpStrength = this.baseJumpStrength; // Dynamically changes
        this.jumpIncreaseSpeed = 0.3; // Speed at which jump strength increases as you hold
        this.maxJumpStrength = 21; // Maximum power we can jump
        this.isJumping = false;

        // Dynamic properties
        this.onPlatform = false;
        this.justBouncedOffWall = false;
        this.isRunning = false;
        this.runIndex = 0; // Counter for the running animation
        this.facingLeft = false; // Used for flipping the image when facing left
        this.leftHeld = false;
        this.rightHeld = false;
        this.jumpHeld = false;
        this.state = null; // For drawing the correct image
        this.previousState = null; // For detecting changes in state for playing the correct sound
    }

    getPlayerState() {
        if(this.jumpHeld && this.onPlatform) return "squat";
        if(this.justBouncedOffWall) return "bounce";
        if(this.velocity.y < 0) return "jump";
        if(this.isRunning){
            this.runIndex++;
            // run2 animation gets half as much time as the other 2 main run animations
            if(this.runIndex < 12) return "run1";
            else if(this.runIndex < 18) return "run2"
            else if (this.runIndex < 30) return "run3"
            else this.runIndex = 0;
        }
        if(this.onPlatform) return "idle";
        return "fall"
    }

    updatePlayerStates(){
        if(this.state != null) this.previousState = this.state;
        this.state = this.getPlayerState();
    }

    update(map) {
        let currentLines = map.levels[this.levelNum - 1].lines;
        this.updatePlayerStates();
        this.checkLineCollisions(currentLines);
        this.applyPlayerMovement();
        this.updateJumpStrength();
        this.applyGravity();
        this.checkAdvanceLevel(map);
    }

    checkAdvanceLevel(map) {
        if (this.y + this.height < 0) {
            this.levelNum += 1;
            this.y = map.canvasHeight;
        } else if (this.y > map.canvasHeight) {
            if(this.levelNum > 1){
                this.levelNum -= 1;
                this.y = 0;
            }
            // If we're on level 1, we don't want to go below the canvas
            else {
                this.x = initX;
                this.y = initY;
            }
        }

        this.levelImage = map.levels[this.levelNum - 1].image;
        this.levelLines = map.levels[this.levelNum - 1].lines;
    }

    applyPlayerMovement() {
        this.isRunning = false;
        if (this.rightHeld && this.onPlatform) {
            this.isRunning = true;
            this.facingLeft = false;

            this.velocity.x = this.playerMovementSpeed;
        } else if (this.leftHeld && this.onPlatform) {
            this.isRunning = true;
            this.facingLeft = true;

            this.velocity.x = -this.playerMovementSpeed;
        } else if (this.onPlatform) {
            this.velocity.x = 0;
        }

        // lateralJumpingSpeed is different if you just bounced off a wall compared to a normal jump
        if (!this.justBouncedOffWall) {
            if (this.isJumping && this.isMovingRight()) {
                this.velocity.x = this.lateralJumpingSpeed;
            } else if (this.isJumping && this.isMovingLeft()) {
                this.velocity.x = -this.lateralJumpingSpeed;
            }
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
                if (
                    collidedLines[0].isDiagonal ||
                    collidedLines[1].isDiagonal
                ) {
                    chosenLine = collidedLines[0].isDiagonal
                        ? collidedLines[0]
                        : collidedLines[1];
                } else {
                    var lineHoriz = collidedLines[0].isHorizontal
                        ? collidedLines[0]
                        : collidedLines[1];
                    var lineVert = collidedLines[0].isVertical
                        ? collidedLines[0]
                        : collidedLines[1];

                    if (this.velocity.y == 0) {
                        chosenLine = lineVert;
                    } else {
                        var yCorrection = Math.min(
                            Math.abs(this.y + this.height - lineHoriz.y1),
                            Math.abs(this.y - lineHoriz.y1)
                        );
                        var xCorrection = Math.min(
                            Math.abs(this.x - lineVert.x1),
                            Math.abs(this.x + this.width - lineVert.x1)
                        );

                        chosenLine =
                            yCorrection <= xCorrection ? lineHoriz : lineVert;
                    }
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
            this.justBouncedOffWall = false;
            if (this.velocity.y >= 0 && !this.onPlatform) {
                this.onPlatform = true;
                this.isJumping = false;
                this.y = line.y1 - this.height;
            } else if (this.velocity.y < 0) {
                this.velocity.y = -this.velocity.y / 3;
                this.y = line.y1 + 10;
                this.y += this.velocity.y;
            }
        } else if (line.isVertical) {
            this.x = this.velocity.x > 0 ? line.x1 - this.width : line.x1;
            this.velocity.x = -(this.velocity.x / 2); // Dull and invert x velocity when we bounce off a wall
            if (!this.onPlatform) this.justBouncedOffWall = true; // If we're not on a platform, we just bounced off a wall
        } else {
            this.y = this.getDiagonalYIntersect(line) - this.height - 1;

            if (line.x2 > line.x1) {
                this.velocity.x = this.diagonalSlideSpeed;
            } else {
                this.velocity.x = -this.diagonalSlideSpeed;
            }

            this.velocity.y = this.velocity.y / 2;
        }
    }

    getDiagonalYIntersect(line) {
        var slope = (line.y2 - line.y1) / (line.x2 - line.x1);
        var y_intercept = line.y2 - slope * line.x2;

        return Math.min(
            slope * this.x + y_intercept,
            slope * (this.x + this.width) + y_intercept
        );
    }

    isCollidingWithLine(line) {
        var isPlayerWithinLineX = false;
        var isPlayerWithinLineY = false;
        var isPlayerWithinDiagonal = false;

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
        } else {
            // calculate the distance to intersection point

            isPlayerWithinDiagonal =
                this.isCollidingWithDiagonal(
                    this.x,
                    this.x + this.width,
                    this.y,
                    this.y,
                    line
                ) ||
                this.isCollidingWithDiagonal(
                    this.x,
                    this.x,
                    this.y,
                    this.y + this.height,
                    line
                ) ||
                this.isCollidingWithDiagonal(
                    this.x + this.width,
                    this.x + this.width,
                    this.y,
                    this.y + this.height,
                    line
                );
        }

        return (
            (isPlayerWithinLineX && isPlayerWithinLineY) ||
            isPlayerWithinDiagonal
        );
    }

    isCollidingWithDiagonal(x1, x2, y1, y2, line) {
        let uA =
            ((line.x2 - line.x1) * (y1 - line.y1) -
                (line.y2 - line.y1) * (x1 - line.x1)) /
            ((line.y2 - line.y1) * (x2 - x1) - (line.x2 - line.x1) * (y2 - y1));
        let uB =
            ((x2 - x1) * (y1 - line.y1) - (y2 - y1) * (x1 - line.x1)) /
            ((line.y2 - line.y1) * (x2 - x1) - (line.x2 - line.x1) * (y2 - y1));

        // if uA and uB are between 0-1, lines are colliding
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) return true;

        return false;
    }

    updateJumpStrength() {
        if (
            this.onPlatform &&
            this.jumpHeld &&
            this.jumpStrength < this.maxJumpStrength
        ) {
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
if (typeof module === 'object') module.exports = Player; // We only want to export as a module for the node.js server, not for the browser client
