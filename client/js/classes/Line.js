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
        let left =    this.lineToLineCollision(player.x, player.y,player.x, player.y+player.height);
        let right =   this.lineToLineCollision(player.x+player.width,player.y, player.x+player.width,player.y+player.height);
        let top =     this.lineToLineCollision(player.x,player.y, player.x+player.width, player.y);
        let bottom =  this.lineToLineCollision(player.x,player.y+player.height, player.x+player.width,player.y+player.height);
      
        // if ANY of the above are true, the line
        // has hit the rectangle
        if (left || right || top || bottom) {
            console.log(player.y +"," + player.height +"," + bottom)
            console.log(this.y1)
            player.onPlatform =true;
            if( player.y+player.height == this.y1){
                console.log(player.y+player.height)
                console.log(this.y1)
                player.onPlatform =true;
            }
          return true;
        }
        player.onPlatform = false ;
        return false;
    }

    lineToLineCollision(playerX1, playerY1, playerX2, playerY2){
        let uA = ((playerX2-playerX1)*(this.y1-playerY1) - (playerY2-playerY1)*(this.x1-playerX1)) / 
            ((playerY2-playerY1)*(this.x2-this.x1) - (playerX2-playerX1)*(this.y2-this.y1));
        let uB = ((this.x2-this.x1)*(this.y1-playerY1) - (this.y2-this.y1)*(this.x1-playerX1)) / ((playerY2-playerY1)*(this.x2-this.x1) - (playerX2-playerX1)*(this.y2-this.y1));
      
        // if uA and uB are between 0-1, lines are colliding
        if(uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
          return true;
        }
        return false;
    }
}   