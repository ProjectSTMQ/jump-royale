class Map{

    map = {
        0 : {
                lines : [new Line(150,150,200,200), new Line(0,0,100,100), new Line(250,150,350,150)],
                image : "placeholder"
            },
        1 :    
            {
                lines : [new Line(25,25,100,100)],
                image : "placeholder"
            }
    }
    

    constructor(mapID){
        this.mapID = mapID
    }

    draw(){
        for(let object of this.map[this.mapID].lines){
            object.draw()
        }
      
    }

    setLevel(mapID){
        this.mapID = mapID
    }

    checkCollision(player){
        for(let object of this.map[this.mapID].lines){
            if(object.checkCollision(player)){
                return true
            }
        }
        return false
    }

  
}