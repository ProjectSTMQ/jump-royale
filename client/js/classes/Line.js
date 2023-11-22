class Line{
    constructor(x1, y1, x2, y2){
        this.x1 = x1
        this.y1 = y1

        this.x2 = x2
        this.y2 = y2
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }

    checkCollision(player){
        left =   lineToLineCollision(player.x, player.y,player.x, player.y+player.height);
        right =  lineToLineCollision(player.x+player.width,player.y, player.x+player.width,player.y+player.height);
        top =    lineToLineCollision(player.x,player.y, player.x+player.width, player.y);
        bottom = lineToLineCollision(player.x,player.y+player.height, player.x+player.width,player.y+player.height);
      
        // if ANY of the above are true, the line
        // has hit the rectangle
        if (left || right || top || bottom) {
          return true;
        }
        return false;
    }

    lineToLineCollision(x1,x2,x3,x4){
        uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
        uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
      
        // if uA and uB are between 0-1, lines are colliding
        if(uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
          return true;
        }
        return false;
    }
}