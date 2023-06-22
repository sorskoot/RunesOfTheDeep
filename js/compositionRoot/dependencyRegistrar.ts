import { container } from "tsyringe";
import { ChestCreator } from "../dungeongen/ChestCreator.js";
import { ItemCreator, LootTable } from "../dungeongen/loot/lootTableBase.js";
import { RoomItemCreator } from "../dungeongen/roomItemCreator.js";
import { GameState } from "../classes/gameState.js";
import { RoomCreator } from "../dungeongen/RoomCreator.js";

export class DependencyRegistrar {
  public static registerDependencies(): void {
    container.registerSingleton(GameState, GameState);
    container.registerSingleton(ChestCreator, ChestCreator);
    container.registerSingleton(LootTable, LootTable);
    container.registerSingleton(RoomItemCreator, RoomItemCreator);
    container.registerSingleton(ItemCreator, ItemCreator);
    container.registerSingleton(RoomCreator, RoomCreator);
  }
}
