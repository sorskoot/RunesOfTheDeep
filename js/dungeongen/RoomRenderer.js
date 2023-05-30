import { WonderlandEngine, Object3D } from "@wonderlandengine/api";
import { Tags, cloneObject } from "@sorskoot/wonderland-components";
//import { LevelData } from "../data/level-data";
import { Room } from "./room";
import { DoorHandler } from "../components/door-handler";
import { TileSet } from "./tileset";
import RNG from "@sorskoot/wonderland-components/src/utils/rng";
import { roomTemplates } from "./roomTemplates";

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
    //const roomdesign = LevelData[0];
    let template = roomTemplates.find((template) => template.type == room.getRoomType());

    const roomdesign = template.pattern;
    for (let i = 0; i < roomdesign.length; i++) {
      for (let j = 0; j < roomdesign[i].length; j++) {
        for (let h = 0; h < template.ceilingHeight[0]; h++) {
          let tile;
          switch (roomdesign[i][j]) {
            case "#":
              tile = this.tileset.getTileByName("Wall01");
              break;
            case "C":
            case ".":
              if (h == 0) {
                tile = this.tileset.getTileByName("Floor01");
              } else if (h == template.ceilingHeight[0] - 1) {
                tile = this.tileset.getTileByName("Ceiling01");
              } else {
                continue;
              }
              break;
            case "N":
              tile = this.#renderDoorOrWall(h, room.doors.north);
              break;
            case "E":
              tile = this.#renderDoorOrWall(h, room.doors.east);
              break;
            case "S":
              tile = this.#renderDoorOrWall(h, room.doors.south);
              break;
            case "W":
              tile = this.#renderDoorOrWall(h, room.doors.west);
              break;
            default:
              continue;
          }
          if (tile) {
            // only render a tile if we have a tile.
            let newObj = this.createTile(i, h, j, tile.object);
            let tags = newObj.getComponent(Tags);
            if (tags && tags.hasTag("Door")) {
              let door = roomdesign[i][j];
              let oldComp = newObj.getComponent(DoorHandler);
              if (oldComp) {
                oldComp.direction = door;
                oldComp.targetRoomX = room.getTargetRoom(door).x;
                oldComp.targetRoomY = room.getTargetRoom(door).y;
                oldComp.active = true;
              } else
                newObj.addComponent(DoorHandler, {
                  direction: door,
                  targetRoomX: room.getTargetRoom(door).x,
                  targetRoomY: room.getTargetRoom(door).y,
                });
            }
          }
        }
      }
    }
    //     for (let h = 0; h < roomdesign.depth; h++) {
    //       if (roomdesign.data[i][j][h]) {
    //         let door = roomdesign.data[i][j][h].door;
    //         let data = roomdesign.data[i][j][h].data;
    //         let setupDoor = false;
    //         if (door != null && door != undefined) {
    //           setupDoor = true;
    //           if (door == 0 && !room.doors.north) {
    //             data = "Wall01";
    //             setupDoor = false;
    //           }
    //           if (door == 1 && !room.doors.east) {
    //             data = "Wall01";
    //             setupDoor = false;
    //           }
    //           if (door == 2 && !room.doors.south) {
    //             data = "Wall01";
    //             setupDoor = false;
    //           }
    //           if (door == 3 && !room.doors.west) {
    //             data = "Wall01";
    //             setupDoor = false;
    //           }
    //         }

    //         let tile = this.tileset.getTileByName(data);

    //         let newObj = this.createTile(i, j, h, tile.object);

    //         if (door != undefined && setupDoor) {
    //           let oldComp = newObj.getComponent(DoorHandler);
    //           if (oldComp) {
    //             oldComp.direction = door;
    //             oldComp.targetRoomX = room.getTargetRoom([..."NESW"][door]).x;
    //             oldComp.targetRoomY = room.getTargetRoom([..."NESW"][door]).y;
    //             oldComp.active = true;
    //           } else
    //             newObj.addComponent(DoorHandler, {
    //               direction: door,
    //               targetRoomX: room.getTargetRoom([..."NESW"][door]).x,
    //               targetRoomY: room.getTargetRoom([..."NESW"][door]).y,
    //             });
    //         }

    //         if (door != undefined && !setupDoor) {
    //           //add an extra wall to close the gap
    //           this.createTile(i, j + 1, h, tile.object);
    //         }
    //       }
    //     }
    //   }
    //}

    this.createInerior(room, roomdesign);
  }

  #renderDoorOrWall(h, hasDoor) {
    if (h === 0) {
      if (hasDoor) {
        return this.tileset.getTileByName("Door");
      } else {
        return this.tileset.getTileByName("Wall01");
      }
    } else if (h === 1 && !hasDoor) {
      return this.tileset.getTileByName("Wall01");
    } else if (h > 1) {
      return this.tileset.getTileByName("Wall01");
    }
  }

  /**
   * Creates the interior of a room
   * @param {Room} room
   * @param {*} roomdesign
   */
  createInerior(room, roomdesign) {
    const roomRNG = RNG.clone().setSeed(room.seed);
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
