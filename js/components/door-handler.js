import { Component, Type } from "@wonderlandengine/api";
import { CursorTarget } from "@wonderlandengine/components";
import GameGlobals from "../globals";

export class DoorHandler extends Component {
  static TypeName = "door-handler";
  static Properties = {
    direction: { type:  Type.String},
    targetRoomX: { type:  Type.Int },
    targetRoomY: { type:  Type.Int },
  };

  start() {
    const target = this.object.getComponent(CursorTarget);

    target.onClick.add(()=>{
        GameGlobals.gameState.navigateToRoom(this.targetRoomX, this.targetRoomY, this.direction);
    });
  }
}
