type Coordinates= {
  x:number
  y:number
}



class Entity{
  name: string;
  pos: Coordinates;
  hp: number = 10;
  map: GameMap;
  constructor(pos:Coordinates = {x:2,y:2}, name = "Default"){
    this.pos = pos;
    this.name = name;
  }
  setPos(x:number ,y:number){
    this.pos.x = x;
    this.pos.y = y;
  }

}

class Enemy extends Entity{
  constructor(pos:Coordinates = {x:2,y:2}, name = "Default",map){
    super(pos,name)
    this.map = map;
  }
  inRange(playerPos:Coordinates){
    //true if in detection range else false
    //HARDCODED DETECTION RANGE
    if(Math.abs(playerPos.x - this.pos.x) + Math.abs(playerPos.y - this.pos.y)  < 5 ){
      return true;
    }
    else{
      return false;
    }
  }

  follow(){

  }

  getPossibleMoves(playerPos:Coordinates , myPos:Coordinates):string {
    let futureMoves = "";
    if(this.pos.x - playerPos.x > 0){
      futureMoves+="a";
    }else if(this.pos.x - playerPos.x < 0){
      futureMoves+="d";
    }else{
      //console.log("do not move X direction")
    }
    if(this.pos.y - playerPos.y > 0){
      futureMoves+="w";
    }else if(this.pos.y - playerPos.y < 0){
      futureMoves+="s";
    }else{
      //console.log("do not move Y direction")
    }
    return futureMoves;
  }

  action(playerPos:Coordinates , futurecoordinates:Coordinates){
    if(this.inRange(playerPos)){
      console.log(this.name," moving to player");
      let validMoves = this.getPossibleMoves(futurecoordinates,this.pos);
      let validPositions = [];
      for (const moves in validMoves){
        if(this)
      }
    }
    //do something based on player coordinates
    //if player is [CURRENTLY] or in the [FUTURE] will be next to [ENEMY] update position
  }
}

class Player extends Entity{

}

class EntityManager{
  player: Player = new Player();
  map: GameMap = new GameMap();
  canvas:HTMLCanvasElement = document.querySelector('canvas')!;
  renderCtx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
  enemies: Enemy[]= [];

  //setup canvas
  createCanvas(){
    this.map.createMap(40);
    console.log("DO NOT ADD ANYTHING MORE TO GAME MAP SEPERATE ENTITIES")
    //const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    let ctx = this.renderCtx!;

    //########################### 3d party blurry canvas fix ###########################
    //https://codepen.io/DoomGoober/pen/vYOvPJg
    const myCanvas = this.canvas;
    const originalHeight = myCanvas.height;
    const originalWidth = myCanvas.width;
    render();
    function render() {
      let dimensions = getObjectFitSize(
        true,
        myCanvas.clientWidth,
        myCanvas.clientHeight,
        myCanvas.width,
        myCanvas.height
      );
      myCanvas.width = dimensions.width;
      myCanvas.height = dimensions.height;

      let ctx = myCanvas.getContext("2d")!;
      let ratio = Math.min(
        myCanvas.clientWidth / originalWidth,
        myCanvas.clientHeight / originalHeight
      );
      ctx.scale(ratio, ratio); //adjust this!

    }
    // adapted from: https://www.npmjs.com/package/intrinsic-scale
    function getObjectFitSize(
      contains: boolean /* true = contain, false = cover */,
      containerWidth: number,
      containerHeight: number,
      width: number,
      height: number
    ) {
      var doRatio = width / height;
      var cRatio = containerWidth / containerHeight;
      var targetWidth = 0;
      var targetHeight = 0;
      var test = contains ? doRatio > cRatio : doRatio < cRatio;

      if (test) {
        targetWidth = containerWidth;
        targetHeight = targetWidth / doRatio;
      } else {
        targetHeight = containerHeight;
        targetWidth = targetHeight * doRatio;
      }

      return {
        width: targetWidth,
        height: targetHeight,
        x: (containerWidth - targetWidth) / 2,
        y: (containerHeight - targetHeight) / 2
      };
    }
    //###########################3d party blurry canvas fix #############################
    //console.log(instance.rooms)
    //console.log(instance.printMap());
    
    this.renderCtx?.transform(1,0,0,1,0,0);
    //this.map.printMapToCanvas(this.renderCtx);
    }
  
  //Clear and redraw everything
  render(){
    this.renderCtx.clearRect(0, 0, manager.canvas.width, manager.canvas.height);
    this.map.printMapToCanvas(this.renderCtx);
    //Draw all entities here
    
    this.map.drawEntity(this.renderCtx, this.player.pos,"red");
    this.map.drawEntity(this.renderCtx,this.enemies[0].pos,"yellow")
    this.map.drawEntity(this.renderCtx,this.enemies[1].pos,"yellow")
  }
  //###TEMPORARY###########
  CreateTestEntity(){
    let pos = {...this.player.pos};
    pos.x+=1;
    //adjacent
    this.enemies.push(new Enemy({...pos},"Enemy 1",this.map))
    //not adjustacent
    pos.x-=3;
    this.enemies.push(new Enemy({...pos},"Enemy 2",this.map))
  }

  //###TEMPORARY###########

  spawnPlayer(){
    let array=this.map.roomCenter.flat(5);
    console.log(array)
    let x,y;
    let randomRoom = array[Math.floor(Math.random()*array.length)]
    this.player.setPos(randomRoom.x, randomRoom.y);
    console.log(randomRoom.x, randomRoom.y)
    //set window size then set to player coordinates
    this.renderCtx?.transform(100/9,0,0,100/9, 0, 0);
    this.renderCtx?.transform(1,0,0,1, -randomRoom.x+4, -randomRoom.y+4);
  }

  checkIfValidMove(key: string , entity:Entity): Coordinates {
    if(key === 'w'){
      if(this.map.map[entity.pos.y-1][entity.pos.x]){
        return {x:entity.pos.x,y:entity.pos.y-1}
      }
    } else if(key === 's'){
      if(this.map.map[entity.pos.y+1][entity.pos.x]){
        return {x:entity.pos.x,y:entity.pos.y+1}
      }
    } else if(key === 'a'){
      if(this.map.map[entity.pos.y][entity.pos.x-1]){
        return {x:entity.pos.x-1,y:entity.pos.y}
      }
    } else if(key === 'd'){
      if(this.map.map[entity.pos.y][entity.pos.x+1]){
        return {x:entity.pos.x+1,y:entity.pos.y}
      }
    } else {
      //XxXXXXXX consider removal only call render once XXXXxXXXXxXXxX
      manager.render();
      return false;
    }
  }


  //only update on keypress serves as update function as well
  handlekeypress(key:string){
    //check if valid move for player, return future coordinates
    let movement = this.checkIfValidMove(key,this.player);
    //do nothing if invalid space
    if(!movement){
    } else {
      //check if interact with entities before commiting to a move
      //if interact block movement trigger action
      this.enemies.forEach(e => e.action({...this.player.pos},{...movement},))
      this.player.pos=movement;
    }
    console.log(movement)

    //After player actions update all AI

    this.render()
  }
}

const manager = new EntityManager();
manager.createCanvas();
manager.spawnPlayer();
manager.CreateTestEntity();
console.log(manager.map.printMap());
manager.render();



const canvas = document.querySelector('canvas')
let ctx=manager.renderCtx;

let keypressed=false;
window.addEventListener('keydown',(e)=>{
  console.log("keypressed")
  // if(keypressed === true){
  //   return;
  // }
  keypressed=true;
  if(e.key === 'w'){
    manager.handlekeypress(e.key)
  } else if(e.key === 's'){
    manager.handlekeypress(e.key)
  } else if(e.key === 'a'){
    manager.handlekeypress(e.key)
  } else if(e.key === 'd'){
    manager.handlekeypress(e.key)
  } else {
    manager.render();
    return;
  }
 //manager.map.printMapToCanvas(manager.renderCtx);
})

window.addEventListener('keyup', ()=>{
  keypressed = false;
})