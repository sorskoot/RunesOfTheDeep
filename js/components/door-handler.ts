import { Component } from "@wonderlandengine/api";
import { CursorTarget } from "@wonderlandengine/components";
import GameGlobals from "../globals.js";
import {property} from '@wonderlandengine/api/decorators.js';
import { DirectionSymbol } from "../types/index.js";
import { wlUtils } from "@sorskoot/wonderland-components";

/**
 * This class handles the door interactions
 * @class DoorHandler
 * @extends {Component}
 * @member {string} direction - The direction of the door
 */
export class DoorHandler extends Component {
  static TypeName = "door-handler";

  /**
   * @type {DirectionSymbol} The direction the door is facing
   */  
  @property.string("N")
  direction:DirectionSymbol = "N";

  /**
   * @type {number} X position of the room behind the door.
   */
  @property.int(0)
  targetRoomX:number =0 ;

  /**
   * @type {number} Y position of the room behind the door.
   */
  @property.int(0)
  targetRoomY:number = 0;

  start() {
    let child = wlUtils.findChild(this.object, "collisionObject");
    if (!child) {
      console.warn("DoorHandler needs a child object with the name 'collisionObject'");
      return;
    }
    const target = child.getComponent(CursorTarget);
    if (!target) {
      console.warn("DoorHandler needs a CursorTarget component on the same object");
      return;
    }

    target.onClick.add(() => {
      return;
    });
  }
}
