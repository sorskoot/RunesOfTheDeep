import { Shield } from "../../classes/items/shield.js";
import { Sword } from "../../classes/items/sword.js";
import { Item } from "../objects/item.js";
import { injectable } from "tsyringe";

export interface LootTableEntry {
  item: Item;
  weight: number; // The higher the weight, the more likely this item will drop
}

export interface LootTableBase {
  lootEntries: Map<string, LootTableEntry[]>;
}
export type lootTypes = "common" | "rare" | "epic" | "legendary" |"entry";

@injectable()
export class LootTable implements LootTableBase {

  lootEntries: Map<lootTypes, LootTableEntry[]>;

  constructor(){
  //@inject(ItemCreator) private itemCreator: ItemCreator) {
    this.lootEntries = new Map([
      ["entry", [
        { item: new Sword() , weight: 1 },
        { item: new Shield(), weight: 1 },
      ]],
      ["rare", [
        { item: new Sword(), weight: 1 },
        { item: new Sword(), weight: 1 },
      ]]
    ]);
  }
  
  getItems(type:lootTypes): Item[] {
    return this.lootEntries.get(type)!.map(e=>e.item);
  }
}
