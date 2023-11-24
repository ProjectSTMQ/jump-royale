class Map{
    
    constructor(){
        this.levels = []
        this.levelNum = 0
        this.levelLines = []
        this.newLevel = null

        this.createLevels()
    }

    // Generated code by level setup option in index.js
    createLevels(){
        this.levelLines.push(new Line(50,900,1150,900))
        this.levelLines.push(new Line(350,500,1150,500))
        this.levelLines.push(new Line(50, 700, 50, 900))
        this.levelLines.push(new Line(350, 700, 350, 900))
        this.levelLines.push(new Line(150, 200, 150, 550))
        this.newLevel = new Level(0, this.levelLines)
        this.levels.push(this.newLevel)
        this.levelLines = []
    }

    getLevels(){
        return this.levels
    }
}