class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;

        this.x2 = x2;
        this.y2 = y2;

        this.isHorizontal = y1 === y2;
        this.isVertical = x1 === x2;
        this.isDiagonal = Math.abs(x1 - x2) === Math.abs(y1 - y2);

        this.ensurePointsAreInOrder();
    }

    draw() {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
    }

    // x1 <= x2 and y1 <= y2 for when we check for player collisions in isCollidingWithLine()
    ensurePointsAreInOrder() {
        if (this.isHorizontal || this.isVertical) {
            if (this.x1 > this.x2 || this.y1 > this.y2) {
                [this.x1, this.x2] = [this.x2, this.x1];
                [this.y1, this.y2] = [this.y2, this.y1];
            }
        }
    }
}
