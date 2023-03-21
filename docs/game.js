"use strict";
class Entity {
    constructor() {
        this.pos = { x: 2, y: 2 };
        this.hp = 10;
    }
}
class Enemy extends Entity {
    action(playercoordinates) {
        //do something based on player coordinates
    }
}
class Player extends Entity {
    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }
}
class EntityManager {
    constructor() {
        this.player = new Player();
        this.map = new GameMap();
        this.canvas = document.querySelector('canvas');
        this.renderCtx = this.canvas.getContext('2d');
    }
    //setup canvas
    createCanvas() {
        var _a;
        this.map.createMap(40);
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
    render() {
        this.map.printMapToCanvas(this.renderCtx);
        //Draw all entities here
        this.map.drawEntity(this.renderCtx, this.player.pos.x, this.player.pos.y, "red");
    }
    spawnPlayer() {
        let array = this.map.roomCenter.flat(5);
        console.log(array);
        let x, y;
        let randomRoom = array[Math.floor(Math.random() * array.length)];
        this.player.setPos(randomRoom.x, randomRoom.y);
        //this.renderCtx?.transform(100/9,0,0,100/9, randomRoom.x, randomRoom.y);
    }
    checkIfValidMove(key) {
        if (key === 'w') {
            if (this.map.map[this.player.pos.y - 1][this.player.pos.x]) {
                return [this.player.pos.x, this.player.pos.y - 1];
            }
        }
        else if (key === 's') {
            if (this.map.map[this.player.pos.y + 1][this.player.pos.x]) {
                //if true do something
                return [this.player.pos.x, this.player.pos.y + 1];
            }
        }
        else if (key === 'a') {
            if (this.map.map[this.player.pos.y][this.player.pos.x - 1]) {
                //if true do something
                return [this.player.pos.x - 1, this.player.pos.y];
            }
        }
        else if (key === 'd') {
            if (this.map.map[this.player.pos.y][this.player.pos.x + 1]) {
                //if true do something
                return [this.player.pos.x + 1, this.player.pos.y];
            }
        }
        else {
            manager.render();
            return false;
        }
    }
    //only update on keypress serves as update function as well
    handlekeypress(key) {
        //check if valid move for player, return future coordinates
        let movement = this.checkIfValidMove(key);
        //do nothing if invalid space
        if (!movement) {
        }
        else {
            //check if interact with entities before commiting to a move
            //if interact block movement trigger action
            this.player.pos = { x: movement[0], y: movement[1] };
        }
        console.log(movement);
        //After player actions update all AI
        this.render();
    }
}
const manager = new EntityManager();
manager.createCanvas();
manager.spawnPlayer();
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
    manager.renderCtx.clearRect(0, 0, manager.canvas.width, manager.canvas.height);
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
