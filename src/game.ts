type Coordinates= {
  x:number
  y:number
}


const UI = new UIManager();

class Entity{
  name: string;
  pos: Coordinates;
  maxhp:number = 10;
  hp: number = 10;
  attack:number = 2;
  atkModifiers: {additive:number,multiplicative:number} = {additive:0,multiplicative:1};
  defModifiers: {additive:number,multiplicative:number} = {additive:0,multiplicative:1};
  color:string = "red";
  map: GameMap;
  constructor(pos:Coordinates = {x:2,y:2}, name = "Default",map:GameMap){
    this.pos = pos;
    this.name = name;
    this.map = map
  }

  attackTarget(target:Entity){
    const attack = this.getAttack()
    target.takeDamage(this.getAttack())
    UI.printToConsole(`${this.name} attacks ${target.name}.`)
  }

  getAttack():number {
    return (this.attack * (this.atkModifiers.multiplicative)) + this.atkModifiers.additive;
  }
  takeDamage(damage: number){
    let totaldamage= (damage - this.defModifiers.additive)*(this.defModifiers.multiplicative);
    if(totaldamage < 1) totaldamage = 1;
    UI.printToConsole(`${this.name} takes ${totaldamage} damage.`)
    this.hp -=totaldamage;
  }

  checkIfValidMove(key: string ): Coordinates | undefined{
    if(key === 'w'){
      if(this.map.map[this.pos.y-1][this.pos.x]){
        return {x:this.pos.x,y:this.pos.y-1}
      }
    } else if(key === 's'){
      if(this.map.map[this.pos.y+1][this.pos.x]){
        return {x:this.pos.x,y:this.pos.y+1}
      }
    } else if(key === 'a'){
      if(this.map.map[this.pos.y][this.pos.x-1]){
        return {x:this.pos.x-1,y:this.pos.y}
      }
    } else if(key === 'd'){
      if(this.map.map[this.pos.y][this.pos.x+1]){
        return {x:this.pos.x+1,y:this.pos.y}
      }
    } else {
      //XxXXXXXX consider removal only call render once XXXXxXXXXxXXxX
      manager.render();
      return undefined;
    }
  }

  setPos(x:number ,y:number){
    this.pos.x = x;
    this.pos.y = y;
  }

}

class Enemy extends Entity{
  validPositions:Coordinates[] = [];
  constructor(pos:Coordinates = {x:2,y:2}, name = "Default",map:GameMap){
    super(pos,name,map)
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

  applyMovement(allies: Enemy[] , futureplayer: Coordinates){
    let pos=this.validPositions.pop()
    //if player is not in position and no allies are CURRENTLY in position move into else dont
    //
    if(pos === undefined) return;
    if(JSON.stringify(pos) != JSON.stringify(futureplayer) 
    && (allies.find(e => JSON.stringify(e.pos) === JSON.stringify(pos)) === undefined)
     ) {
      this.pos = {...pos};
      return;
    }
    else {
      if(this.validPositions.length != 0 ) pos = this.validPositions.pop();
      if(JSON.stringify(pos) != JSON.stringify(futureplayer) 
      && (allies.find(e => JSON.stringify(e.pos) === JSON.stringify(pos))=== undefined)
       ){
        this.pos = {...pos}!;
        return;
      }
      //Anti Congo Line Entropy
      let randomdirection=this.checkIfValidMove(['w','a','s','d'][Math.floor(Math.random()*4)]);
      if(randomdirection
        && (allies.find(e => JSON.stringify(e.pos) === JSON.stringify(randomdirection)) === undefined)
        ) this.pos = {...randomdirection};
    } 

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

  action(playerPos:Coordinates , futurecoordinates:Coordinates,player:Entity){
    if(this.inRange(playerPos)){
      console.log(this.name," moving to player");
      this.validPositions = [];
      let validMoves = this.getPossibleMoves(playerPos,this.pos);
      //give random movement if empty
      //console.log("valid moves = ",validMoves.length)
      for (const moves of validMoves){
        const check = this.checkIfValidMove(moves);
        if(check){
          this.validPositions.push(check);
        }
      }
      if(this.validPositions.find(e=>JSON.stringify(e) != JSON.stringify(futurecoordinates)) === undefined){
        console.log("IM ATTACKING THE PLAYER");
        //this.attackTarget(player)
        this.validPositions = [];
      }else if(this.validPositions.find(e=>JSON.stringify(e) != JSON.stringify(playerPos)) === undefined){
        console.log("IM ATTACKING THE PLAYER");
        this.attackTarget(player)
        this.validPositions = [];
      }
      //console.log(this.validPositions , futurecoordinates);
    }
    //do something based on player coordinates
    //if player is [CURRENTLY] or in the [FUTURE] will be next to [ENEMY] update position
  }
}

class Player extends Entity{
  new=true;
  equipment= {
    weapon:{type:"weapon",atk:0},
    armor:{type:"armor", def:0}
  }
  inventory=[];
  constructor(pos:Coordinates = {x:2,y:2}, name = "Player",map){
    super(pos,name,map)
  }
}

class Swarm extends Enemy{
  constructor(pos:Coordinates,name:string,map:GameMap){
    super(pos,name,map)
    this.attack=5;
    this.maxhp = Math.floor(Math.random()*1)+2;
    this.hp=this.maxhp;
    this.color = "#27b7de";
  }
}

class LittleGuy extends Enemy{
  constructor(pos:Coordinates,name:string,map:GameMap){
    super(pos,name,map)
    this.attack=4;
    this.maxhp = Math.floor(Math.random()*2)+8;
    this.hp=this.maxhp;
    this.color = "#8776ff";
  }
}

class BigGuy extends Enemy{
  constructor(pos:Coordinates,name:string,map:GameMap){
    super(pos,name,map)
    this.attack=10;
    this.maxhp = Math.floor(Math.random()*5)+20;
    this.hp=this.maxhp;
    this.color = "red";
  }
}



class EntityManager{
  player: Player = new Player();
  map: GameMap = new GameMap();
  canvas:HTMLCanvasElement = document.querySelector('canvas')!;
  renderCtx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
  enemies: Enemy[]= [];
  //coordinate for key, array of items(objects) at location
  drops= {} //{[key:string]: {}[]} = {};
  score:number = 0;
  //setup canvas
  createCanvas(){
    this.map = new GameMap()
    this.map.createMap(40);
    this.player.map = this.map;
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
    
    //this.renderCtx?.transform(1,0,0,1,0,0);
    //this.map.printMapToCanvas(this.renderCtx);
    }

  renderPlayerMovement(key:string){
    if(key === 'w'){
        this.renderCtx?.transform(1,0,0,1,0,1);
      } else if(key === 's'){
        this.renderCtx?.transform(1,0,0,1,0,-1);
      } else if(key === 'a'){
        this.renderCtx?.transform(1,0,0,1,1,0);
      } else if(key === 'd'){
        this.renderCtx?.transform(1,0,0,1,-1,0);
      } else {
        return;
      }
  }

  //Clear and redraw everything
  render(){
    this.renderCtx.clearRect(-100, -100, 200, 200);
    this.map.printMapToCanvas(this.renderCtx);
    //================================DRAW ALL ENTITIES BELOW HERE================================
    //draw enemies
    this.enemies.forEach(e => this.map.drawEntity(this.renderCtx,e.pos,e.color));
    //draw drops
    for (const [key, value] of Object.entries(this.drops)) {
      let coords = key.split(',');
      if(value.length !== 0){
        this.map.drawEntity(this.renderCtx,{x:parseInt(coords[0]),y:parseInt(coords[1])},"orange");
      }
    }
    //draw player
    this.map.drawEntity(this.renderCtx, this.player.pos,"green");
  
    //console.log(this.player.hp)
    UI.render(this);
  }
  //###TEMPORARY###########
  CreateTestEntity(){
    //RANDOM CENTERs
    this.drops[String([this.player.pos.x,this.player.pos.y])]=[{type:"Health Potion"}]
    // let array=this.map.roomCenter.flat(5);
    // console.log(array)
    // let x,y;
    // let randomRoom = array[Math.floor(Math.random()*array.length)]
    // this.enemies.push(new Enemy({...randomRoom},"Enemy 3",this.map))
    // randomRoom = array[Math.floor(Math.random()*array.length)]
    // this.enemies.push(new Enemy({...randomRoom},"Enemy 4",this.map))
    // this.enemies.push(new Enemy({...randomRoom},"Enemy 5",this.map))
    // this.enemies.push(new Enemy({...randomRoom},"Enemy 6",this.map))
  }

  //###TEMPORARY###########
  spawnSwarm(num:number){
    let array=this.map.roomCenter.flat(5);
    let randomRoom = array[Math.floor(Math.random()*array.length)]
    //pick unoccupied room
    while(JSON.stringify(randomRoom) === JSON.stringify(this.player.pos)  ||
    this.enemies.find(e=>JSON.stringify(e.pos) === JSON.stringify(randomRoom) ) !=undefined 
    ){
      randomRoom = array[Math.floor(Math.random()*array.length)]
    }
    for (let i = 0 ;i < num;i++){
      this.enemies.push(new Swarm({...randomRoom},`Swarm ${i}`,this.map))
    }
  }

  spawnLittleGuy(num:number){
    let array=this.map.roomCenter.flat(5);
    let randomRoom = array[Math.floor(Math.random()*array.length)]
    //pick unoccupied room
    while(JSON.stringify(randomRoom) === JSON.stringify(this.player.pos)  ||
    this.enemies.find(e=>JSON.stringify(e.pos) === JSON.stringify(randomRoom) ) !=undefined 
    ){
      randomRoom = array[Math.floor(Math.random()*array.length)]
    }
    for (let i = 0 ;i < num;i++){
      this.enemies.push(new LittleGuy({...randomRoom},`Little ${i}`,this.map))
    }
  }

  spawnBigGuy(num:number){
    let array=this.map.roomCenter.flat(5);
    let randomRoom = array[Math.floor(Math.random()*array.length)]
    //pick unoccupied room
    while(JSON.stringify(randomRoom) === JSON.stringify(this.player.pos)  ||
    this.enemies.find(e=>JSON.stringify(e.pos) === JSON.stringify(randomRoom) ) !=undefined 
    ){
      randomRoom = array[Math.floor(Math.random()*array.length)]
    }
    for (let i = 0 ;i < num;i++){
      this.enemies.push(new BigGuy({...randomRoom},`Giant ${i}`,this.map))
    }
  }


  spawnPlayer(){
    let array=this.map.roomCenter.flat(5);
    let x,y;
    let randomRoom = array[Math.floor(Math.random()*array.length)]
    console.log(array)
    if(this.player.hp <= 0){
      this.player.new=true;
      this.drops={}
      this.enemies=[]
      this.score=0;
      this.player.equipment= {
        weapon:{type:"weapon",atk:0},
        armor:{type:"armor", def:0}
      }
      this.player.inventory=[];
    }
    if(this.player.new === true){
      this.player.maxhp = 50;
      this.player.hp = 50;
      this.player.new=false;
    }
    if(this.player.hp <= 0){
      this.player.hp = this.player.maxhp
    }
    this.player.setPos(randomRoom.x, randomRoom.y);
    console.log("HERE",this.player.pos)
    this.renderCtx.resetTransform()
    //this.renderCtx?.transform(1000/9,0,0,1000/9, 0,0);
    
    this.renderCtx?.transform(10,0,0,10, 0,0);
    //set window size then set to player coordinates
    this.renderCtx?.transform(1,0,0,1, -randomRoom.x+40, -randomRoom.y+40);
  }

  //--------------------------Add handling of non enemy entities?Treasure?Gold?Items?Only do location not collision checks?
  //only update on keypress serves as update function as well
  //weapon
  //armor
  //healing potion
  getDrops(){
    if(this.drops[String([this.player.pos.x,this.player.pos.y])] != undefined ){
      return this.drops[String([this.player.pos.x,this.player.pos.y])] 
    }
    else{
      return []
    }
  }
  
  generateDropAt(pos:Coordinates){
    //get random valid coordinates
    let randomCoords:[number,number];
      let drop ={} as any;
      //probability distribution
      if(Math.random() < .1){
        //spawnWeapon()
        drop.type="sword";
        drop.atk=Math.floor(Math.random()*2)+3;
      } else if(Math.random() < .1){
        //spawnArmor()
        drop.type="armor";
        drop.def=Math.floor(Math.random()*2)+4;
      } else if(Math.random() < .2){
        //spawnHealthPotion()
        drop.type="Health Potion";
      } else {
        //spawnGold()
        drop.type="Gold";
        drop.amount=Math.floor(Math.random()*8)+3;
      }
      //place item at spot
      if(this.drops[String([pos.x,pos.y])] === undefined){
        this.drops[String([pos.x,pos.y])]=[{...drop}];
      }else{
      this.drops[String([pos.x,pos.y])].push({...drop});
    }
    }
  

  generateDrop(level:number){
    //get random valid coordinates
    let randomCoords:[number,number];
    do{
    randomCoords = [Math.floor(Math.random()*this.map.map.length) , Math.floor(Math.random()*this.map.map.length)]
    }while(JSON.stringify(randomCoords) === JSON.stringify(this.player.pos)  ||
    this.enemies.find(e=>JSON.stringify(e.pos) === JSON.stringify(randomCoords) ) !=undefined ||
    this.drops[String(randomCoords)] !== undefined ||
    this.map.map[randomCoords[1]][randomCoords[0]] === 0
    ){
      let drop ={} as any;
      //probability distribution
      if(Math.random() < .1){
        //spawnWeapon()
        drop.type="sword";
        drop.atk=3;
      } else if(Math.random() < .1){
        //spawnArmor()
        drop.type="armor";
        drop.def=5;
      } else if(Math.random() < .2){
        //spawnHealthPotion()
        drop.type="Health Potion";
      } else {
        //spawnGold()
        drop.type="Gold";
        drop.amount=5
      }
      //place item at spot
      if(this.drops[String(randomCoords)] === undefined){
        this.drops[String(randomCoords)]=[{...drop}];
      }else{
      this.drops[String(randomCoords)].push({...drop});
    }
    }
  }




  handlekeypress(key:string){
    if(this.player.hp <= 0) return;
    //check if valid move for player, return future coordinates
    let futurePos = this.player.checkIfValidMove(key);
    //do nothing if invalid space
    if(!futurePos){
    } else {
      //check player pos moving into enemy
      if(this.enemies.find(e => JSON.stringify(e.pos) === JSON.stringify(futurePos)
      ) !== undefined) {
        //Attack don't move
        console.log("Player is attacking target");
        let target = this.enemies.find(e => JSON.stringify(e.pos) === JSON.stringify(futurePos))!;
        console.log("AM ATTACKIHNG",target)
        this.player.attackTarget(target);
        //delete any with no hp
        this.enemies.filter(e => e.hp <= 0).forEach(e=>{ 
          UI.printToConsole(`${e.name} has been defeated!`);
          this.score+=(e.maxhp*100);
          this.generateDropAt(e.pos);
          this.enemies.splice(this.enemies.indexOf(e),1);
        });
        //all Moove
        this.enemies.forEach(e => e.action({...this.player.pos},{...futurePos!},this.player))
        this.enemies.forEach(e => e.applyMovement(this.enemies,futurePos!))
        futurePos={...this.player.pos}
      } else{
      //All Moving
      this.renderPlayerMovement(key);
      console.log("Not Attacking")
      this.enemies.forEach(e => e.action({...this.player.pos},{...futurePos!},this.player))
      this.enemies.forEach(e => e.applyMovement(this.enemies,futurePos!))
      this.player.pos=futurePos;
      }
    }
    //After player actions update all AI
    this.render()
  }
  attachListeners(){
    const canvas = document.querySelector('canvas')
    let ctx=this.renderCtx;

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
  }
  newLevel(){
    this.enemies=[]
    this.drops = {}
    console.log("NEW DROPS AND ENEMIES",this.drops,this.enemies)
    this.map = new GameMap()
    this.map.createMap(40);
    this.player.map = this.map;
    this.spawnPlayer();
    this.CreateTestEntity();
    this.spawnSwarm(3);
    this.spawnSwarm(5);
    this.spawnSwarm(4);
    this.spawnSwarm(3);
    this.spawnSwarm(1);
    this.spawnLittleGuy(3);
    this.spawnLittleGuy(2);
    this.spawnLittleGuy(1);
    this.spawnLittleGuy(3);
    this.spawnBigGuy(1);
    this.spawnBigGuy(1);

    this.generateDrop(1);
    this.generateDrop(1);
    this.generateDrop(1);
    this.generateDrop(1);
    this.generateDrop(1);
    this.generateDrop(1);
    this.render()
  }
}

const manager = new EntityManager();
manager.createCanvas();
manager.newLevel();
manager.attachListeners();
manager.render()
//manager.createCanvas();
//manager.spawnPlayer();
//manager.player.atkModifiers.push((e)=> e + 10)
console.log(manager.player)

console.log(manager.map.printMap());




