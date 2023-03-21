"use strict";
class UIManager {
    constructor() {
        this.console = document.querySelector('#console');
        this.stats = document.querySelector('#stats');
    }
    printToConsole(text) {
        const ptag = document.createElement('p');
        ptag.textContent = text;
        this.console.prepend(ptag);
    }
    render(player, score) {
        const ptag = document.createElement('p');
        ptag.textContent = `Health  ${player.hp}/${player.maxhp}`;
        const ptag2 = document.createElement('p');
        ptag2.textContent = `Score  ${score}`;
        this.stats.textContent = '';
        this.stats.appendChild(ptag);
        this.stats.appendChild(ptag2);
    }
}
