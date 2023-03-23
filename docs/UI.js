"use strict";
class UIManager {
    constructor() {
        this.console = document.querySelector('#console');
        this.stats = document.querySelector('#stats');
        this.drops = document.querySelector('#flooritems');
        this.inventory = document.querySelector("#inventory");
        this.endscreen = document.querySelector("#modal-area");
        this.winbox = document.querySelector('#winbox');
        this.losebox = document.querySelector('#losebox');
        this.endscreen.addEventListener('click', (e => {
            manager.newLevel();
        }));
    }
    printToConsole(text) {
        const ptag = document.createElement('p');
        ptag.textContent = text;
        this.console.prepend(ptag);
    }
    renderStats(player, score) {
        const ptag = document.createElement('p');
        ptag.textContent = `Health  ${player.hp}/${player.maxhp}`;
        const ptag2 = document.createElement('p');
        ptag2.textContent = `Score  ${score}`;
        this.stats.textContent = '';
        this.stats.appendChild(ptag);
        this.stats.appendChild(ptag2);
        //Print equipment
        let equipment = Object.keys(player.equipment);
        console.log(JSON.stringify(player.equipment));
        for (const key of equipment) {
            const ptag3 = document.createElement('p');
            ptag3.textContent = JSON.stringify(player.equipment[key]).replace(/[{"},:]|type/g, ' ');
            this.stats.appendChild(ptag3);
        }
    }
    renderNearbyDrops(drops) {
        this.drops.textContent = '';
        drops.forEach(drop => {
            let ptag = document.createElement('p');
            ptag.textContent = JSON.stringify(drop).replace(/[{"},:]|type/g, ' ');
            //function closure
            ptag.addEventListener('click', e => this.handlePickUpDrop(drops, drop));
            this.drops.appendChild(ptag);
        });
    }
    renderInventory(inventory) {
        this.inventory.textContent = '';
        console.log(inventory);
        for (const item of inventory) {
            const ptag = document.createElement('p');
            ptag === null || ptag === void 0 ? void 0 : ptag.textContent = JSON.stringify(item).replace(/[{"},:]|type/g, ' ');
            ptag.addEventListener('click', e => this.handleUseInventory(inventory, item));
            this.inventory.appendChild(ptag);
        }
    }
    renderEndScreen() {
        if (manager.player.hp <= 0) {
            this.endscreen.className = '';
            this.losebox.className = '';
            this.winbox.className = 'disable';
            return;
        }
        else {
            this.endscreen.className = 'disable';
            this.losebox.className = 'disable';
        }
        if (manager.enemies.length === 0) {
            this.endscreen.className = 'modal-area-victory';
            this.losebox.className = 'disable';
            this.winbox.className = '';
        }
        else {
            this.endscreen.className = 'disable';
            this.winbox.className = 'disable';
        }
    }
    render(manager) {
        this.renderStats(manager.player, manager.score);
        this.renderNearbyDrops(manager.getDrops());
        this.renderInventory(manager.player.inventory);
        this.renderEndScreen();
    }
    handleUseInventory(inventory, item) {
        if (item.type === "Health Potion") {
            manager.player.hp += 20;
            if (manager.player.hp > manager.player.maxhp)
                manager.player.hp = manager.player.maxhp;
            inventory.splice(inventory.findIndex(e => e === item), 1);
        }
        else if (item.type === "sword") {
            manager.player.atkModifiers.additive = item.atk;
            manager.player.equipment.weapon = Object.assign({}, item);
        }
        else if (item.type === "armor") {
            manager.player.defModifiers.additive = item.def;
            manager.player.equipment.armor = Object.assign({}, item);
        }
        this.render(manager);
    }
    handlePickUpDrop(drops, drop) {
        if (drop.type === "Gold") {
            manager.score += drop.amount * 100;
            drops.splice(drops.findIndex(e => e === drop), 1);
        }
        else {
            manager.player.inventory.push(Object.assign({}, drop));
            drops.splice(drops.findIndex(e => e === drop), 1);
        }
        this.render(manager);
    }
}
