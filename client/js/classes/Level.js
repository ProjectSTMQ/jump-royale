class Level{
    constructor(levelNum, levelLines) {
        this.lines = levelLines;
        this.levelNum = levelNum;
        this.image = './imgs/test.png'; // tmp, need to change constructor parameters (and Map.js createLevels() ?)
    }

    draw(){
        for(let object of this.lines){
            object.draw()
        }
    }
}