import { Item } from "../../dungeongen/objects/item.js";
import { BehaviorBase } from "../behaviorBase.js";

type Rarity = "common" | "rare" | "epic" | "legendary";
type ItemType = "weapon" | "container" | "item" | "shield";

export abstract class GenericItem extends BehaviorBase implements Item {
   
  id: number;
  name: string;  
  active: boolean;
  type: ItemType;  
  description: string;
  rarity: Rarity;

  constructor(rarity:Rarity="common") {
    super();
    this.id = +new Date();
    this.active = false;
    this.type = "item";    
    this.name = "Nameless Item";
    this.description = "it is nothing special";
    this.rarity = rarity;
  }

  damage():number {
    return 0;
  }

  protection():number {
    return 0;
  }

  range?() {
    return 0;
  }

  attack?(){}

  turn?() {}

  equip?() {}

  unequip?() {}

  refresh?() {}

  over?() {
    return true;
  }

  createUI?() {
    return 0;
  }
}
