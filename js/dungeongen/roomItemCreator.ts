import { RoomTemplate, RoomTemplatePatternDefinitions, chestDefinition } from "./roomTemplates.js";
import { Room } from "./room.js";
import { DirectionSymbol } from "../types/simpleTypes.js";
import { Door } from "./objects/door.js";
import { GenericItem } from "./objects/GenericItem.js";

import { injectable, inject } from "tsyringe";
import { chestCreator } from "./objects/chest.js";
import { rng }  from "@sorskoot/wonderland-components";

@injectable()
export class RoomItemCreator {

    chestCreator: chestCreator;

    constructor(@inject('ChestCreator') chestCreator: chestCreator){
        this.chestCreator = chestCreator;
    }

    createItems(template:RoomTemplate, room:Room):GenericItem[]{
        let items:GenericItem[] = [];
        const currentRng = rng.clone().setSeed(room.seed);
        for (let y = 0; y < template.pattern.length; y++) {
            for (let x = 0; x < template.pattern[y].length; x++) {
              if (RoomTemplatePatternDefinitions[template.pattern[y][x]]?.behavior) {
                switch (template.pattern[y][x]) {
                  case "N":
                  case "S":
                  case "E":
                  case "W":
                    let direction = template.pattern[y][x] as DirectionSymbol;
                    let target = room.getTargetRoom(direction);
                    if (target){
                      const newLocal = new Door(direction, target, { x: x, y: y });
                      items.push(newLocal);
                    }
                    break;
                  case "!": //chest
                    if(!template.chests){
                        console.error("No chest definition found for room template, but a chest was found in the pattern");
                        break;
                    }
                    let chest = currentRng.getItem(template.chests) as chestDefinition;
                    let chestItem = this.chestCreator?.createChest({ x: x, y: y }, chest);
                    items.push(chestItem);
                    break;
                }
              }
            }
          }
        return items;
    }
}