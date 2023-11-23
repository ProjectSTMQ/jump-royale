// class Map{

//     map = {
//         0 : {
//                 lines : [new Line(50,900,1150,900), new Line(350,500,1150,500), new Line(50, 900, 50, 700)],
//                 image : "placeholder"
//             },
//         1 :    
//             {
//                 lines : [new Line(25,25,100,100)],
//                 image : "placeholder"
//             }
//     }
    

//     constructor(mapID){
//         this.mapID = mapID
//     }

//     draw(){
//         for(let object of this.map[this.mapID].lines){
//             object.draw()
//         }
//     }

//     setLevel(mapID){
//         this.mapID = mapID
//     }

//     checkCollision(player){
//         for(let object of this.map[this.mapID].lines){
//             if(object.checkCollision(player)){
//                 return true
//             }
//         }
//         return false
//     }

  
// }