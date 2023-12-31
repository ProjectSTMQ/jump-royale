class Level {
    constructor(levelNum, levelLines, image) {
        this.levelNum = levelNum;
        this.lines = levelLines;
        this.image = image;
    }

    draw() {
        for (let object of this.lines) {
            object.draw();
        }
    }
}

module.exports = Level;
