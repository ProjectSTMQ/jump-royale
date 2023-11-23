class Level{
    constructor() {
        this.lines = [new Line(50,900,1150,900), new Line(350,500,1150,500), new Line(50, 900, 50, 700), new Line(350, 900, 350, 700)];
        this.levelNum = 0;
        this.image = null;
    }

    draw(){
        for(let object of this.lines){
            object.draw()
        }
    }
}