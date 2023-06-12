import { Item } from "../objects/item.js";

export interface LootTableEntry {
  item: Item;
  weight: number; // The higher the weight, the more likely this item will drop
}

export interface LootTable {
  chestType: string; // small, medium, large, special
  minItems: number; // Minimum number of items that can be dropped from this chest
  maxItems: number; // Maximum number of items that can be dropped from this chest
  lootEntries: Array<LootTableEntry>;
}
