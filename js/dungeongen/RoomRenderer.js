import { WonderlandEngine, Object3D } from "@wonderlandengine/api";
import { cloneObject } from "@sorskoot/wonderland-components";
import { LevelData } from "../data/level-data";
import { Room } from "./room";
import { DoorHandler } from "../components/door-handler";
import { TileSet } from "./tileset";

export class RoomRenderer {
  /**
   *
   * @param {WonderlandEngine} engine
   * @param {Object3D} parent
   * @param {TileSet} tileset
   * @param {*} blockCache
   */
  constructor(engine, parent, tileset, blockCache) {
    this.engine = engine;
    this.parent = parent;
    this.tileset = tileset;
    this.blockCache = blockCache;
  }

  /**
   * Renders a room
   * @param {Room} room The room to render
   */
  render(room) {
    const roomdesign = LevelData[0];

    for (let i = 0; i < roomdesign.width; i++) {
      for (let j = 0; j < roomdesign.height; j++) {
        for (let h = 0; h < roomdesign.depth; h++) {
          const tileIndex = roomdesign.data[i][j][h];
          if (tileIndex != null && tileIndex != undefined) {
            let setupDoor = false;
            if (tileIndex.door) {
              setupDoor = true;
              if (tileIndex.door == 0 && !room.doors.north) {
                tileIndex.data = "Wall01";
                setupDoor = false;
              }
              if (tileIndex.door == 1 && !room.doors.east) {
                tileIndex.data = "Wall01";
                setupDoor = false;
              }
              if (tileIndex.door == 2 && !room.doors.south) {
                tileIndex.data = "Wall01";
                setupDoor = false;
              }
              if (tileIndex.door == 3 && !room.doors.west) {
                tileIndex.data = "Wall01";
                setupDoor = false;
              }
            }
            let tile = this.tileset.getTileByName(tileIndex.data);
            let newObj = this.createTile(i, j, h, tile.object);
         
            if (tileIndex.door && setupDoor) {
              newObj.addComponent(DoorHandler, {
                direction: tileIndex.door,
                targetRoomX: room.getTargetRoom([..."NESW"][tileIndex.door]).x,
                targetRoomY: room.getTargetRoom([..."NESW"][tileIndex.door]).y,
              });              
            }

            if(tileIndex.door && !setupDoor){ //add an extra wall to close the gap
                this.createTile(i, j+1, h, tile.object);
            }
          }
        }
      }
    }
  }

  /**
   *
   * @param {*} x
   * @param {*} y
   * @param {*} z
   * @param {*} tile
   * @returns Object3D
   */
  createTile(x, y, z, tile) {
    let blockObj = tile;
    let obj = cloneObject(this.engine, blockObj, this.blockCache);
    obj.resetPositionRotation();
    obj.setPositionLocal([x, y, z]);
    return obj;
  }
}
