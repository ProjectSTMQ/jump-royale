class Level{
    constructor() {
        this.lines = [new Line(50,900,1150,900), new Line(350,500,1150,500), new Line(50, 700, 50, 900), new Line(350, 700, 350, 900), new Line(150, 200, 150, 550)];
        this.levelNum = 0;
        this.image = null;
    }

    draw(){
        for(let object of this.lines){
            object.draw()
        }
    }
}