import { Position2D } from "../types/position.js";
import { LootTable } from "./loot/lootTableBase.js";
import { chestDefinition } from "./roomTemplates.js";
import { GenericItem } from "./objects/GenericItem.js";
import { inject, singleton } from "tsyringe";
import { Chest } from "./objects/chest.js";


@singleton()
export class ChestCreator {

    constructor(@inject(LootTable) private lootTable: LootTable) {
    }

    createChest(position: Position2D, chestDefinition: chestDefinition): GenericItem {
        const chestItem = new Chest("small", "common", 3, this.lootTable);
        chestItem.position = position;
        chestItem.name = "Chest";

        return chestItem;
    }
}
