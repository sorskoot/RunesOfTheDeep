import { GenericItem } from "../objects/GenericItem.js";
import { BehaviorBase } from "../objects/behaviorBase.js";
import { Item } from "../objects/item.js";
import { singleton } from "tsyringe";

@singleton()
export class ItemCreator implements ItemCreatorBase {

  constructor() {
  }

  createItem(baseItem: GenericItem, behaviors: BehaviorBase[] | null = null): Item {
    const item = baseItem;
    if (behaviors != null && behaviors.length > 0) {
      for (const behavior of behaviors) {
        item.addBehavior(behavior);
      }
    }
    return item;
  }
}

export interface ItemCreatorBase{
  createItem(baseItem:GenericItem, behaviors:BehaviorBase[]|null): Item;
  createItem(baseItem:GenericItem): Item;
}

