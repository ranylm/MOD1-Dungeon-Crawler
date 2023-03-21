
type Room ={
  x1:number
  y1:number
  x2:number
  y2:number
}


//DO NOT ADD ANYTHING MORE SEPERATE ENTITIES
class GameMap{
  //player: Player = new Player();
  map: number[][]= [];
  mapDimensions: number = 0;
  rooms: Room[] = [];
  roomCenter: {x:number,y:number,visted:boolean}[][] = [];
  edges: Set<string> = new Set<string>;

  
  
  //Create Map
  createMap(dimension:number){
    this.mapDimensions = dimension;
    this.map = [];
    for ( let i=0 ; i < dimension ; i++){
      this.map.push(new Array(dimension).fill(0));
    }
    this.roomCenter= [...Array((dimension/10) )].map(e=>Array((dimension/10 )))
    //console.log(this.roomCenter)
    this.addRooms();
    this.connectRooms();
    this.addEdges()
  }
  
  addRoom(x:number,y:number, 
    roomX:number, roomY:number, 
    roomX2:number, roomY2:number)
    {
    for(let j = y + roomY ; j < y + roomY +roomY2 ; j++){
      for(let i = x + roomX ; i < x + roomX +roomX2 ; i++){
        //console.log(i,j)
        this.map[j][i] = 1 ;
      }
   }
  }

  addRooms(){
    for( let x = 0; x < this.map.length ; x += 10){
      for( let y = 0; y < this.map.length ; y += 10){
        //Set corner coordinates
        let roomX = Math.floor(Math.random()*2) + 1;
        let roomY = Math.floor(Math.random()*2) + 1;
        //Set secondary coordinates
        let roomX2 = Math.floor(Math.random()*3) +7 -(roomX);
        let roomY2 = Math.floor(Math.random()*3) +7 -(roomY);
        //!!!!!!TBA!!!!!! Bound Check Rooms
        this.rooms.push({
          x1 : (roomX + x),
          y1 : (roomY + y),
          x2 :  (roomX2),
          y2 :  (roomY2)
        })
        this.roomCenter[Math.floor((roomY + y) /10)][Math.floor((roomX +x) /10)]=(
          {
          x: (x + Math.floor((roomX2 + roomX)/2)),
          y: (y + Math.floor((roomY2 + roomY)/2)),
          visted:false
        })
        this.addRoom(x,y, roomX,roomY, roomX2,roomY2)
      }
    }
  }

  connectRooms(){
    for(let i = 0 ; i < this.roomCenter.length ; i++){
      for (let j = 0 ; j < this.roomCenter[i].length ; j++){
        //select valid direction
        let connections = 0;
        this.roomCenter[j][i].visted = true;
        //find valid directons
        let validNodes : number[] = [];
        if( i > 0) validNodes.push( (i-1)*4  + j);
        if(i < this.roomCenter.length -1) validNodes.push( ((i+1)*4 + j );
        if( j > 0 ) validNodes.push( j - 1 + (i *4) );
        if( j < this.roomCenter[i].length -1) validNodes.push( j + 1 +(i *4) )
        //console.log("DIRECTIONS=" , validNodes)
        //find nodes with no edge
        let noEdges=[];
        let origin= (i*4) +j;
        for (const node of validNodes){
          let target=node;
          if(this.edges.has(origin < node ?  `${origin},${node}`: `${node},${origin}`)){
            //if edge exists do nothing
            connections++;
          } else {
            noEdges.push(node)
          }
        }
        //idk why connections less than 4 works so well vs connection++
        while(connections < validNodes.length -1 && connections < 4){
          //pick random edge to join
          let randomNode = noEdges[Math.floor(Math.random()*noEdges.length)]
          this.edges.add(origin < randomNode ?  `${origin},${randomNode}`: `${randomNode},${origin}`)
          noEdges.splice(noEdges.findIndex((e)=>e === randomNode),1)
          connections++;
        }
      }
    }
    //console.log(this.edges)
  }

  //====================================Render Functions====================================
  //Draw Map
  printMap(){
    let string = '';
    for (const row of this.map){
      let rowString = '';
      for (const column of row){
        rowString+= column;
      }
      rowString+= '\n' ;
      string += rowString;
    }
    return string;
  }

  printMapToCanvas(ctx: CanvasRenderingContext2D){
    ctx.fillStyle  = "black";
    ctx.fillRect(0,0,this.mapDimensions,this.mapDimensions);
    this.drawRooms(ctx);
    // this.drawPlayer(ctx);
    this.drawEdges(ctx);
    this.drawRoomCenters(ctx);
  }


  //Draw paths between rooms
  addEdges(){
    console.log(this.edges)
    const draw = (node1: number, node2: number)=>{
      console.log([node1,node2])
      let coordinate1 = this.roomCenter[Math.floor(node1/4)][node1%4];
      let coordinate2 = this.roomCenter[Math.floor(node2/4)][node2%4];
      //console.log(coordinate1,coordinate2)
      if(Math.abs(coordinate1.x-coordinate2.x) > Math.abs(coordinate1.y-coordinate2.y) ){
        let y=Math.floor(( coordinate1.y + coordinate2.y) / 2);
        let lower = coordinate1.x < coordinate2.x ? coordinate1.x : coordinate2.x ;
        let higher = coordinate1.x < coordinate2.x ? coordinate2.x : coordinate1.x ;
        //console.log("DRAWING",lower,higher , y);
        for( let i = lower ; i < higher ; i++){
          this.map[y][i] = 1;
        }
      } else{
        let x=Math.floor(( coordinate1.x + coordinate2.x) / 2);
        let lower = coordinate1.y < coordinate2.y ? coordinate1.y : coordinate2.y ;
        let higher = coordinate1.y < coordinate2.y ? coordinate2.y : coordinate1.y ;
        //console.log("DRAWING",lower,higher, x);
        for( let i = lower ; i < higher ; i++){
          this.map[i][x] = 1;
        }
      }
    }
    this.edges.forEach((edge)=>{
      let pair = edge.split(',');
      draw.bind(this)(parseInt(pair[0]),parseInt(pair[1]));
    }
    )
    //console.log(this.printMap())
    
  }

  drawEdges(ctx:CanvasRenderingContext2D){
    console.log(this.edges)
    const draw = (node2: number, node1: number)=>{
      let coordinate1 = this.roomCenter[Math.floor(node1/4)][node1%4];
      let coordinate2 = this.roomCenter[Math.floor(node2/4)][node2%4];
      //console.log(coordinate1,coordinate2)
      if(Math.abs(coordinate1.x-coordinate2.x) > Math.abs(coordinate1.y-coordinate2.y) ){
        let y=Math.floor(( coordinate1.y + coordinate2.y) / 2);
        let lower = coordinate1.x < coordinate2.x ? coordinate1.x : coordinate2.x ;
        let higher = coordinate1.x < coordinate2.x ? coordinate2.x : coordinate1.x ;
        //console.log("DRAWING",lower,higher , y);
        ctx.fillStyle = "white";
        ctx.fillRect(lower, y, higher-lower, 1);
      } else{
        let x=Math.floor(( coordinate1.x + coordinate2.x) / 2);
        let lower = coordinate1.y < coordinate2.y ? coordinate1.y : coordinate2.y ;
        let higher = coordinate1.y < coordinate2.y ? coordinate2.y : coordinate1.y ;
        //console.log("DRAWING",lower,higher, x);
        ctx.fillStyle = "white";
        ctx.fillRect(x, lower, 1, higher-lower);
      }
    }
    this.edges.forEach((edge)=>{
      let pair = edge.split(',');
      draw.bind(this)(parseInt(pair[0]),parseInt(pair[1]));
    }
    )
    //console.log(this.printMap())
    
  }

  drawRooms(ctx:CanvasRenderingContext2D){
    for (const room of this.rooms){
      //ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.fillRect(room.x1,room.y1,room.x2,room.y2);
      //ctx.stroke();
    }
  }
  
  drawRoomCenters(ctx:CanvasRenderingContext2D){
    for (const row of this.roomCenter){
      for (const column of row){
        ctx.fillStyle = "blue";
        ctx.fillRect(column.x, column.y ,1 ,1 );
      }
    }
  }

  drawEntity(ctx:CanvasRenderingContext2D, x:number, y:number, color:string = "red"){
    ctx.fillStyle = color;
    ctx.fillRect(x, y ,1 ,1 );
  }

}

// const instance = new GameMap();
// instance.createMap(40);
// console.log(instance.roomCenter);
// console.log(instance.rooms);
// console.log(instance.printMap());



// instance.createMap(40);
// console.log("DO NOT ADD ANYTHING MORE TO GAME MAP SEPERATE ENTITIES")
// const canvas = document.querySelector('canvas') as HTMLCanvasElement;
// let ctx = canvas.getContext('2d');

// instance.printMapToCanvas(ctx);

// //########################### 3d party blurry canvas fix ###########################
// //https://codepen.io/DoomGoober/pen/vYOvPJg
// const myCanvas = canvas;
// const originalHeight = myCanvas.height;
// const originalWidth = myCanvas.width;
// render();
// function render() {
//   let dimensions = getObjectFitSize(
//     true,
//     myCanvas.clientWidth,
//     myCanvas.clientHeight,
//     myCanvas.width,
//     myCanvas.height
//   );
//   myCanvas.width = dimensions.width;
//   myCanvas.height = dimensions.height;

//   let ctx = myCanvas.getContext("2d");
//   let ratio = Math.min(
//     myCanvas.clientWidth / originalWidth,
//     myCanvas.clientHeight / originalHeight
//   );
//   ctx.scale(ratio, ratio); //adjust this!

// }
// // adapted from: https://www.npmjs.com/package/intrinsic-scale
// function getObjectFitSize(
//   contains /* true = contain, false = cover */,
//   containerWidth,
//   containerHeight,
//   width,
//   height
// ) {
//   var doRatio = width / height;
//   var cRatio = containerWidth / containerHeight;
//   var targetWidth = 0;
//   var targetHeight = 0;
//   var test = contains ? doRatio > cRatio : doRatio < cRatio;

//   if (test) {
//     targetWidth = containerWidth;
//     targetHeight = targetWidth / doRatio;
//   } else {
//     targetHeight = containerHeight;
//     targetWidth = targetHeight * doRatio;
//   }

//   return {
//     width: targetWidth,
//     height: targetHeight,
//     x: (containerWidth - targetWidth) / 2,
//     y: (containerHeight - targetHeight) / 2
//   };
// }
// //###########################3d party blurry canvas fix #############################
// //console.log(instance.rooms)
// //console.log(instance.printMap());

// ctx.transform(100/9,0,0,100/9,0,0);
// instance.printMapToCanvas(ctx);
//ctx?.transform(100/9,0,0,100/9,0,0);
//ctx?.transform(1,0,0,1,0,0);
// instance.printMapToCanvas(ctx)
// eventlisteners for each direcetion, check validity of movement beofre



// let keypressed=false;
// window.addEventListener('keydown',(e)=>{
//   console.log("keypressed")
//   // if(keypressed === true){
//   //   return;
//   // }
//   keypressed=true;
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   if(e.key === 'w'){
//     ctx?.transform(1,0,0,1,0,1);
//   } else if(e.key === 's'){
//     ctx?.transform(1,0,0,1,0,-1);
//   } else if(e.key === 'a'){
//     ctx?.transform(1,0,0,1,1,0);
//   } else if(e.key === 'd'){
//     ctx?.transform(1,0,0,1,-1,0);
//   } else {
//     instance.printMapToCanvas(ctx);
//     return;
//   }
//   instance.printMapToCanvas(ctx);
// })

// window.addEventListener('keyup', ()=>{
//   keypressed = false;
// })