import { inject, singleton } from "tsyringe";
import { RoomItemCreator } from "./roomItemCreator.js";
import { Room } from "./room.js";
import { RoomTemplate } from "./roomTemplates.js";

@singleton()
export class RoomCreator{
    
    constructor(@inject(RoomItemCreator) private roomItemCreator: RoomItemCreator){

    }

    setUpRoom(room:Room, template:RoomTemplate):boolean{
        room.initialize(template)
        room.items = this.roomItemCreator.createItems(template,room);
        return true;
    }
}