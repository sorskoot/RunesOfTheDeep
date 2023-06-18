import { RoomTemplate, RoomTemplatePatternDefinitions } from "./roomTemplates.js";
import { Room } from "./room.js";
import { DirectionSymbol } from "../types/simpleTypes.js";
import { Door } from "./objects/door.js";
import { GenericItem } from "./objects/GenericItem.js";
import { injectable } from "tsyringe";

@injectable()
export class RoomItemCreator {

    createItems(template:RoomTemplate, room:Room):GenericItem[]{
        let items:GenericItem[] = [];

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
                }
              }
            }
          }
        return items;
    }
}