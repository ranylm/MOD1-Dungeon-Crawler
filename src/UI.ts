class UIManager {
  console: HTMLElement = document.querySelector('#console') as HTMLElement;
  stats: HTMLElement = document.querySelector('#stats') as HTMLElement;
  drops: HTMLElement= document.querySelector('#flooritems') as HTMLElement;
  inventory: HTMLElement = document.querySelector("#inventory") as HTMLElement;
  endscreen:HTMLElement = document.querySelector("#modal-area") as HTMLElement;
    winbox:HTMLElement = document.querySelector('#winbox') as HTMLElement;
    losebox:HTMLElement = document.querySelector('#losebox') as HTMLElement;

  constructor(){
    this.endscreen.addEventListener('click',(e=>{
      manager.newLevel();
    }))
  }

  printToConsole(text:string){
    const ptag = document.createElement('p');
    ptag.textContent=text;
    this.console.prepend(ptag);
  }

  renderStats(player:Player, score : number){
    const ptag = document.createElement('p');
    ptag.textContent = `Health  ${player.hp}/${player.maxhp}`;
    const ptag2 = document.createElement('p');
    ptag2.textContent = `Score  ${score}`;
    this.stats.textContent='';
    this.stats.appendChild(ptag);
    this.stats.appendChild(ptag2);

    //Print equipment
    let equipment = Object.keys(player.equipment);
    console.log(JSON.stringify(player.equipment))
    for( const key of equipment){
      const ptag3 = document.createElement('p');
      ptag3.textContent = JSON.stringify(player.equipment[key]);
      this.stats.appendChild(ptag3);
    }
  }

  renderNearbyDrops(drops:{}[]){
    this.drops.textContent=''
    drops.forEach( drop =>{
      let ptag = document.createElement('p');
      ptag.textContent=JSON.stringify(drop);
      //function closure
      ptag.addEventListener('click',e => this.handlePickUpDrop(drops,drop))
      this.drops.appendChild(ptag);
    })
  }

  renderInventory(inventory:[]){
    this.inventory.textContent='';
    console.log(inventory)
    for (const item of inventory){
      const ptag=document.createElement('p');
      ptag?.textContent = JSON.stringify(item);
      ptag.addEventListener('click',e => this.handleUseInventory(inventory, item));
      this.inventory.appendChild(ptag)
    }
  }

  renderEndScreen(){
    if(manager.player.hp <=0){
      this.endscreen.className = '';
      this.losebox.className = ''
      this.winbox.className='disable'
      return;
    }else{
      this.endscreen.className = 'disable';
      this.losebox.className = 'disable'
    }
    if(manager.enemies.length === 0){
      this.endscreen.className = 'modal-area-victory';
      this.losebox.className='disable'
      this.winbox.className=''
    }else{
      this.endscreen.className = 'disable';
      this.winbox.className='disable'
    }
  }
  render(manager:EntityManager){
    this.renderStats(manager.player, manager.score);
    this.renderNearbyDrops(manager.getDrops())
    this.renderInventory(manager.player.inventory)
    this.renderEndScreen();
  }

  handleUseInventory(inventory:[], item:{}){
    if(item.type === "Health Potion"){
      manager.player.hp += 20;
      if(manager.player.hp > manager.player.maxhp) manager.player.hp = manager.player.maxhp;
      inventory.splice(inventory.findIndex(e => e === item),1);
    } else if(item.type === "sword"){
      manager.player.atkModifiers.additive= item.atk;
      manager.player.equipment.weapon = {...item}
    }else if(item.type === "armor"){
      manager.player.defModifiers.additive= item.def;
      manager.player.equipment.armor = {...item}
    }
    this.render(manager)
  }


  handlePickUpDrop(drops:{}[], drop:{}){
    if(drop.type === "Gold"){
      manager.score+= drop.amount *100;
      drops.splice(drops.findIndex(e => e === drop),1);
    }
    else{
      manager.player.inventory.push({...drop})
      drops.splice(drops.findIndex(e => e === drop),1);
    }
    this.render(manager);
  }
}

