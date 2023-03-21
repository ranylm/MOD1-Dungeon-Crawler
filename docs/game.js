"use strict";
class Entity {
    constructor(pos = { x: 2, y: 2 }, name = "Default", map) {
        this.hp = 10;
        this.pos = pos;
        this.name = name;
        this.map = map;
    }
    checkIfValidMove(key) {
        if (key === 'w') {
            if (this.map.map[this.pos.y - 1][this.pos.x]) {
                return { x: this.pos.x, y: this.pos.y - 1 };
            }
        }
        else if (key === 's') {
            if (this.map.map[this.pos.y + 1][this.pos.x]) {
                return { x: this.pos.x, y: this.pos.y + 1 };
            }
        }
        else if (key === 'a') {
            if (this.map.map[this.pos.y][this.pos.x - 1]) {
                return { x: this.pos.x - 1, y: this.pos.y };
            }
        }
        else if (key === 'd') {
            if (this.map.map[this.pos.y][this.pos.x + 1]) {
                return { x: this.pos.x + 1, y: this.pos.y };
            }
        }
        else {
            //XxXXXXXX consider removal only call render once XXXXxXXXXxXXxX
            manager.render();
            return false;
        }
    }
    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }
}
class Enemy extends Entity {
    constructor(pos = { x: 2, y: 2 }, name = "Default", map) {
        super(pos, name, map);
        this.validPositions = [];
    }
    inRange(playerPos) {
        //true if in detection range else false
        //HARDCODED DETECTION RANGE
        if (Math.abs(playerPos.x - this.pos.x) + Math.abs(playerPos.y - this.pos.y) < 5) {
            return true;
        }
        else {
            return false;
        }
    }
    applyMovement(allies, futureplayer) {
        let pos = this.validPositions.pop();
        //if player is not in position and no allies are CURRENTLY in position move into else dont
        //
        if (pos === undefined)
            return;
        console.log(JSON.stringify(pos) != JSON.stringify(futureplayer));
        console.log(allies.find(e => JSON.stringify(e.pos) === JSON.stringify(pos)) === undefined);
        if (JSON.stringify(pos) != JSON.stringify(futureplayer)
            && (allies.find(e => JSON.stringify(e.pos) === JSON.stringify(pos)) === undefined)) {
            console.log("HERE");
            this.pos = Object.assign({}, pos);
        }
        else {
            if (this.validPositions.length != 0)
                pos = this.validPositions.pop();
            if (JSON.stringify(pos) != JSON.stringify(futureplayer)
                && (allies.find(e => JSON.stringify(e.pos) === JSON.stringify(pos)) === undefined)) {
                this.pos = Object.assign({}, pos);
            }
        }
    }
    getPossibleMoves(playerPos, myPos) {
        let futureMoves = "";
        if (this.pos.x - playerPos.x > 0) {
            futureMoves += "a";
        }
        else if (this.pos.x - playerPos.x < 0) {
            futureMoves += "d";
        }
        else {
            //console.log("do not move X direction")
        }
        if (this.pos.y - playerPos.y > 0) {
            futureMoves += "w";
        }
        else if (this.pos.y - playerPos.y < 0) {
            futureMoves += "s";
        }
        else {
            //console.log("do not move Y direction")
        }
        return futureMoves;
    }
    action(playerPos, futurecoordinates) {
        if (this.inRange(playerPos)) {
            console.log(this.name, " moving to player");
            this.validPositions = [];
            let validMoves = this.getPossibleMoves(playerPos, this.pos);
            for (const moves of validMoves) {
                const check = this.checkIfValidMove(moves);
                if (check) {
                    this.validPositions.push(check);
                }
            }
            //console.log(this.validPositions , futurecoordinates);
        }
        //do something based on player coordinates
        //if player is [CURRENTLY] or in the [FUTURE] will be next to [ENEMY] update position
    }
}
class Player extends Entity {
    constructor(pos = { x: 2, y: 2 }, name = "Player", map) {
        super(pos, name, map);
    }
}
class EntityManager {
    constructor() {
        this.player = new Player();
        this.map = new GameMap();
        this.canvas = document.querySelector('canvas');
        this.renderCtx = this.canvas.getContext('2d');
        this.enemies = [];
    }
    //setup canvas
    createCanvas() {
        var _a;
        this.map.createMap(40);
        this.player.map = this.map;
        console.log("DO NOT ADD ANYTHING MORE TO GAME MAP SEPERATE ENTITIES");
        //const canvas = document.querySelector('canvas') as HTMLCanvasElement;
        let ctx = this.renderCtx;
        //########################### 3d party blurry canvas fix ###########################
        //https://codepen.io/DoomGoober/pen/vYOvPJg
        const myCanvas = this.canvas;
        const originalHeight = myCanvas.height;
        const originalWidth = myCanvas.width;
        render();
        function render() {
            let dimensions = getObjectFitSize(true, myCanvas.clientWidth, myCanvas.clientHeight, myCanvas.width, myCanvas.height);
            myCanvas.width = dimensions.width;
            myCanvas.height = dimensions.height;
            let ctx = myCanvas.getContext("2d");
            let ratio = Math.min(myCanvas.clientWidth / originalWidth, myCanvas.clientHeight / originalHeight);
            ctx.scale(ratio, ratio); //adjust this!
        }
        // adapted from: https://www.npmjs.com/package/intrinsic-scale
        function getObjectFitSize(contains /* true = contain, false = cover */, containerWidth, containerHeight, width, height) {
            var doRatio = width / height;
            var cRatio = containerWidth / containerHeight;
            var targetWidth = 0;
            var targetHeight = 0;
            var test = contains ? doRatio > cRatio : doRatio < cRatio;
            if (test) {
                targetWidth = containerWidth;
                targetHeight = targetWidth / doRatio;
            }
            else {
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
        (_a = this.renderCtx) === null || _a === void 0 ? void 0 : _a.transform(1, 0, 0, 1, 0, 0);
        //this.map.printMapToCanvas(this.renderCtx);
    }
    //Clear and redraw everything
    render() {
        this.renderCtx.clearRect(0, 0, manager.canvas.width, manager.canvas.height);
        this.map.printMapToCanvas(this.renderCtx);
        //Draw all entities here
        this.map.drawEntity(this.renderCtx, this.player.pos, "green");
        this.map.drawEntity(this.renderCtx, this.enemies[0].pos, "red");
        this.map.drawEntity(this.renderCtx, this.enemies[1].pos, "red");
        this.map.drawEntity(this.renderCtx, this.enemies[2].pos, "red");
        this.map.drawEntity(this.renderCtx, this.enemies[3].pos, "red");
    }
    //###TEMPORARY###########
    CreateTestEntity() {
        let pos = Object.assign({}, this.player.pos);
        pos.x += 1;
        //adjacent
        this.enemies.push(new Enemy(Object.assign({}, pos), "Enemy 1", this.map));
        //not adjustacent
        pos.x -= 3;
        this.enemies.push(new Enemy(Object.assign({}, pos), "Enemy 2", this.map));
        //RANDOM CENTERs
        let array = this.map.roomCenter.flat(5);
        console.log(array);
        let x, y;
        let randomRoom = array[Math.floor(Math.random() * array.length)];
        this.enemies.push(new Enemy(Object.assign({}, randomRoom), "Enemy 3", this.map));
        randomRoom = array[Math.floor(Math.random() * array.length)];
        this.enemies.push(new Enemy(Object.assign({}, randomRoom), "Enemy 4", this.map));
    }
    //###TEMPORARY###########
    spawnPlayer() {
        let array = this.map.roomCenter.flat(5);
        console.log(array);
        let x, y;
        let randomRoom = array[Math.floor(Math.random() * array.length)];
        this.player.setPos(randomRoom.x, randomRoom.y);
        console.log(randomRoom.x, randomRoom.y);
        //set window size then set to player coordinates
        //this.renderCtx?.transform(100/9,0,0,100/9, 0, 0);
        //sthis.renderCtx?.transform(1,0,0,1, -randomRoom.x+4, -randomRoom.y+4);
    }
    //only update on keypress serves as update function as well
    handlekeypress(key) {
        //check if valid move for player, return future coordinates
        let futurePos = this.player.checkIfValidMove(key);
        //do nothing if invalid space
        if (!futurePos) {
        }
        else {
            //check player pos  moving into enemy
            if (this.enemies.find(e => {
                let bool = JSON.stringify(e.pos) === JSON.stringify(futurePos);
                console.log(e.pos, futurePos, bool);
                return bool;
            }) !== undefined) {
                return;
            }
            this.enemies.forEach(e => e.action(Object.assign({}, this.player.pos), Object.assign({}, futurePos)));
            //ITERATIVELY APPLY
            this.enemies.forEach(e => e.applyMovement(this.enemies, futurePos));
            this.enemies.forEach(e => console.log(e.pos));
            this.player.pos = futurePos;
        }
        console.log(futurePos);
        //After player actions update all AI
        this.render();
    }
}
const manager = new EntityManager();
manager.createCanvas();
manager.spawnPlayer();
manager.CreateTestEntity();
console.log(manager.map.printMap());
manager.render();
const canvas = document.querySelector('canvas');
let ctx = manager.renderCtx;
let keypressed = false;
window.addEventListener('keydown', (e) => {
    console.log("keypressed");
    // if(keypressed === true){
    //   return;
    // }
    keypressed = true;
    if (e.key === 'w') {
        manager.handlekeypress(e.key);
    }
    else if (e.key === 's') {
        manager.handlekeypress(e.key);
    }
    else if (e.key === 'a') {
        manager.handlekeypress(e.key);
    }
    else if (e.key === 'd') {
        manager.handlekeypress(e.key);
    }
    else {
        manager.render();
        return;
    }
    //manager.map.printMapToCanvas(manager.renderCtx);
});
window.addEventListener('keyup', () => {
    keypressed = false;
});
