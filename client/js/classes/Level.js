class Level{
    constructor(levelNum, levelLines) {
        this.lines = levelLines;
        this.levelNum = levelNum;
        this.image = null;
    }

    draw(){
        for(let object of this.lines){
            object.draw()
        }
    }
}