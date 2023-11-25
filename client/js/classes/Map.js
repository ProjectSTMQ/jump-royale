class Map{
    
    constructor(){
        this.levels = []
        // this.levelNum = 0
        this.levelLines = []
        this.newLevel = null

        this.createLevels()
    }

    // Generated code by level setup option in index.js (predefined)
    createLevels(){
        // this.levelLines.push(new Line(50,900,1150,900))
        // this.levelLines.push(new Line(350,500,1150,500))
        // this.levelLines.push(new Line(50, 700, 50, 900))
        // this.levelLines.push(new Line(350, 800, 350, 900)) // PIXELS FUCK
        // this.levelLines.push(new Line(350, 800, 450, 800))
        // this.levelLines.push(new Line(750, 800, 650, 900)) // 45 deg line for test
        // this.levelLines.push(new Line(150, 200, 150, 550))
        // this.newLevel = new Level(1, this.levelLines, './imgs/levels/1.png')
        // this.levels.push(this.newLevel)
        // this.levelLines = []

        this.levelLines.push(new Line(21, 460, 320, 460))
        this.levelLines.push(new Line(320, 820, 880, 820))
        this.levelLines.push(new Line(880, 460, 1120, 460))
        this.levelLines.push(new Line(320, 460, 320, 815))
        this.levelLines.push(new Line(880, 460, 880, 820))
        this.levelLines.push(new Line(0, 0, 0, 900))
        this.levelLines.push(new Line(1200, 0, 1200, 900))
        this.newLevel = new Level(1, this.levelLines, './imgs/levels/1.png')
        this.levels.push(this.newLevel)
        this.levelLines = []

        // tmp
        this.levelLines.push(new Line(320, 820, 880, 820))
        this.levelLines.push(new Line(0, 0, 0, 900))
        this.levelLines.push(new Line(1200, 0, 1200, 900))
        this.newLevel = new Level(2, this.levelLines, './imgs/levels/2.png')
        this.levels.push(this.newLevel)
        this.levelLines = []
    }

    // Called from main draw() loop in index.js
    checkAdvanceLevel(){
        if(player.y < 0){
            currentLevelNum += 1
            player.y = canvas.height
        }
        else if(player.y > canvas.height){
            currentLevelNum -= 1
            player.y = 0
        }
    }
}