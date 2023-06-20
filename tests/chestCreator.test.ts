import { Sword } from "../js/classes/items/sword.js";
import { LootTableBase, LootTableEntry } from "../js/dungeongen/loot/lootTableBase.js";
import { ChestCreator } from "../js/dungeongen/objects/chest.js";


let chestCreator: ChestCreator;

class TestLootTable implements LootTableBase{
    lootEntries: Map<string, LootTableEntry[]>;
    constructor(){
        this.lootEntries = new Map([
            ["entry", [
              { item: new Sword() , weight: 1 },
            ]]
          ]);
    }
}

beforeEach(() => {
    chestCreator = new ChestCreator(new TestLootTable());
});