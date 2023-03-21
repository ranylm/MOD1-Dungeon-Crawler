class UIManager {
  console: HTMLElement = document.querySelector('#console') as HTMLElement;
  stats: HTMLElement = document.querySelector('#stats') as HTMLElement;
  printToConsole(text:string){
    const ptag = document.createElement('p');
    ptag.textContent=text;
    this.console.prepend(ptag);
  }

  render(player: Entity,score:number){
    const ptag = document.createElement('p');
    ptag.textContent = `Health  ${player.hp}/${player.maxhp}`;
    const ptag2 = document.createElement('p');
    ptag2.textContent = `Score  ${score}`;
    this.stats.textContent='';
    this.stats.appendChild(ptag);
    this.stats.appendChild(ptag2);
  }
}

