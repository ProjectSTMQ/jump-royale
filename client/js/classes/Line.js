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
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
}   