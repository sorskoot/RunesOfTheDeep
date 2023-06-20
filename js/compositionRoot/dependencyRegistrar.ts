import { container } from "tsyringe";
import { ChestCreator } from "../dungeongen/objects/chest.js";
import { ItemCreator, LootTable } from "../dungeongen/loot/lootTableBase.js";
import { RoomItemCreator } from "../dungeongen/roomItemCreator.js";

export class DependencyRegistrar {
  public static registerDependencies(): void {
    container.register("ChestCreator", ChestCreator);
    container.register("LootTable", LootTable);
    container.register("RoomItemCreator", RoomItemCreator);
    container.register("ItemCreator", ItemCreator);
  }
}
