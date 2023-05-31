import { Component, Property } from "@wonderlandengine/api";
import { CursorTarget } from "@wonderlandengine/components";
import GameGlobals from "../globals";

/**
 * This class handles the door interactions 
 * @class DoorHandler
 * @extends {Component}
 * @member {string} direction - The direction of the door
*/
export class DoorHandler extends Component {
  static TypeName = "door-handler";
  static Properties = {
    targetRoomX: Property.int(),
    targetRoomY: Property.int()
  };

   /**
   * @type {number} X position of the room behind the door.
   */
   targetRoomX;
   /**
   * @type {number} Y position of the room behind the door.
   */
   targetRoomY;

  start() {
    const target = this.object.getComponent(CursorTarget);
    if(!target){
      console.error("DoorHandler needs a CursorTarget component on the same object");
      return;
    }

    target.onClick.add(()=>{
        GameGlobals.gameState.navigateToRoom(this.targetRoomX, this.targetRoomY);
    });
  }
}
