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

        // this.levelLines.push(new Line(21, 460, 320, 460))
        // this.levelLines.push(new Line(320, 820, 880, 820))
        // this.levelLines.push(new Line(880, 460, 1120, 460))
        // this.levelLines.push(new Line(320, 460, 320, 815))
        // this.levelLines.push(new Line(880, 460, 880, 820))
        // this.levelLines.push(new Line(0, 0, 0, 900))
        // this.levelLines.push(new Line(1200, 0, 1200, 900))
        // this.newLevel = new Level(1, this.levelLines, './imgs/levels/1.png')
        // this.levels.push(this.newLevel)
        // this.levelLines = []

        // this.levelLines.push(new Line(320, 820, 880, 820))
        // this.levelLines.push(new Line(0, 0, 0, 900))
        // this.levelLines.push(new Line(1200, 0, 1200, 900))
        // this.newLevel = new Level(2, this.levelLines, './imgs/levels/2.png')
        // this.levels.push(this.newLevel)
        // this.levelLines = []

        this.levelLines.push(new Line(19, 2, 19, 460))
        this.levelLines.push(new Line(19, 460, 321, 460))
        this.levelLines.push(new Line(321, 461, 321, 821))
        this.levelLines.push(new Line(320, 818, 879, 818))
        this.levelLines.push(new Line(880, 459, 880, 817))
        this.levelLines.push(new Line(881, 458, 1176, 458))
        this.levelLines.push(new Line(1305, 30, 1305, 459))
        this.levelLines.push(new Line(1181, 1, 1181, 455))
        this.levelLines.push(new Line(462, 94, 462, 220))
        this.levelLines.push(new Line(461, 93, 741, 93))
        this.levelLines.push(new Line(740, 93, 740, 235))
        this.levelLines.push(new Line(464, 219, 740, 219))
        this.levelLines.push(new Line(0, 0, 0, 900))
        this.levelLines.push(new Line(1200, 0, 1200, 900))
        this.newLevel = new Level(1, this.levelLines, './imgs/levels/1.png')
        this.levels.push(this.newLevel)
        this.levelLines = []

        this.levelLines.push(new Line(19, 2, 19, 189))
        this.levelLines.push(new Line(19, 193, 202, 193))
        this.levelLines.push(new Line(202, 195, 202, 419))
        this.levelLines.push(new Line(16, 421, 16, 898))
        this.levelLines.push(new Line(17, 421, 200, 421))
        this.levelLines.push(new Line(298, 257, 298, 415))
        this.levelLines.push(new Line(297, 257, 480, 257))
        this.levelLines.push(new Line(480, 258, 480, 414))
        this.levelLines.push(new Line(298, 415, 480, 415))
        this.levelLines.push(new Line(643, 497, 821, 497))
        this.levelLines.push(new Line(642, 498, 642, 576))
        this.levelLines.push(new Line(643, 575, 823, 575))
        this.levelLines.push(new Line(821, 499, 821, 574))
        this.levelLines.push(new Line(1024, 496, 1024, 573))
        this.levelLines.push(new Line(1024, 493, 1176, 493))
        this.levelLines.push(new Line(1024, 573, 1179, 573))
        this.levelLines.push(new Line(1182, 1, 1182, 492))
        this.levelLines.push(new Line(1179, 575, 1179, 897))
        this.levelLines.push(new Line(740, 740, 740, 819))
        this.levelLines.push(new Line(742, 739, 980, 739))
        this.levelLines.push(new Line(980, 742, 980, 825))
        this.levelLines.push(new Line(742, 818, 978, 818))
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