import iron from "../../classes/behaviors/iron.js";
import { Shield } from "../../classes/items/shield.js";
import { Sword } from "../../classes/items/sword.js";
import { GenericItem } from "../objects/GenericItem.js";
import { BehaviorBase } from "../objects/behaviorBase.js";
import { Item } from "../objects/item.js";
import { injectable, inject } from "tsyringe";

export interface LootTableEntry {
  item: Item;
  weight: number; // The higher the weight, the more likely this item will drop
}

export interface LootTableBase {
  lootEntries: Map<string, LootTableEntry[]>;
}
type lootTypes = "common" | "rare" | "epic" | "legendary" |"entry";

@injectable()
export class LootTable implements LootTableBase {

  itemCreator!: ItemCreatorBase;
  lootEntries: Map<lootTypes, LootTableEntry[]>;

  constructor(@inject("ItemCreator") itemCreator: ItemCreatorBase) {
    this.itemCreator = itemCreator;
    this.lootEntries = new Map([
      ["entry", [
        { item: this.itemCreator.createItem(new Sword()) , weight: 1 },
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

interface ItemCreatorBase{
  createItem(baseItem:GenericItem, behaviors:BehaviorBase[]|null): Item;
  createItem(baseItem:GenericItem): Item;
}

@injectable()
export class ItemCreator implements ItemCreatorBase{
  createItem(baseItem:GenericItem, behaviors: BehaviorBase[] | null = null): Item {
    const item = baseItem;
    if(behaviors != null && behaviors.length > 0){
      for(const behavior of behaviors){
        item.addBehavior(behavior);
      }
    }
    return item;
  }
}
