class Line{
    constructor(x1, y1, x2, y2){
        // Swap if needed - Ensure x1 <= x2 and y1 <= y2 for when we check for player collisions in isCollidingWithLine()
        if(x1 > x2) [x1, x2] = [x2, x1]
        if(y1 > y2) [y1, y2] = [y2, y1]

        this.x1 = x1
        this.y1 = y1

        this.x2 = x2
        this.y2 = y2

        this.isHorizontal = y1 === y2
        this.isVertical = x1 === x2
    }

    draw() {
        ctx.beginPath();

        this.assertlineValid()
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
 
    assertlineValid(){
        if(!(this.x1<=this.x2 && this.y1 <= this.y2)){
            console.log("fucked")
            return false
        }
        return true
    }

    // checkCollision(player){
    //     let left =    this.lineToLineCollision();
    //     let right =   this.lineToLineCollision();
    //     let top =     this.lineToLineCollision();
    //     let bottom =  this.lineToLineCollision();
      
    //     // if ANY of the above are true, the line
    //     // has hit the rectangle
    //     if (left || right || top || bottom) {

    //         player.onPlatform = true;

    //       return true;
    //     }
    //     player.onPlatform = false ;
    //     return false;
    // }

    // checkLinesColliding(x1, y1, x2, y2, x3, y3, x4, y4){
    //     let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    //     let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

    //     // if uA and uB are between 0-1, lines are colliding
    //     if(uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    //       return true;
    //     }
    //     return false;
    // }
}   