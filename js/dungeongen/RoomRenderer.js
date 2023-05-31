/**
 * @file This file contains the RoomRenderer class.
 * @requires typedefs.js
 */

import { WonderlandEngine, Object3D } from "@wonderlandengine/api";
import { Tags, cloneObject } from "@sorskoot/wonderland-components";
import { Room } from "./room";
import { DoorHandler } from "../components/door-handler";
import { TileSet } from "./tileset";
import RNG from "@sorskoot/wonderland-components/src/utils/rng";
import { roomTemplates } from "./roomTemplates";
import { Tile } from "./tile";

/**
 * The Room Renderer is responsible for rendering a room.
 */
export class RoomRenderer {

  /**
   * Instantiates a new RoomRenderer
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
    let template = roomTemplates.find((template) => template.type == room.getRoomType());
    
    if(!template) {
      throw new Error(`No template found for room type ${room.getRoomType()}`);
    }
    
    const roomdesign = template.pattern;
    if(!roomdesign) {
      throw new Error(`No room design found for room type ${room.getRoomType()}`);
    }

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
              this.setupDoor(newObj, room.getTargetRoom(roomdesign[i][j]));
            }
          }
        }
      }
    }
    this.createInerior(room, roomdesign);
  }

  /**
   * Setup the scripts for the door, adding a new one if needed.
   * @param {Object3D} newObj the newly created object (the door)   
   * @param {*} room 
   */
  setupDoor(newObj, room) {
    let oldComp = newObj.getComponent(DoorHandler);
    if (oldComp) {
      oldComp.targetRoomX = room.x;
      oldComp.targetRoomY = room.y;
      oldComp.active = true;
    }
    else
      newObj.addComponent(DoorHandler, {
        targetRoomX: room.x,
        targetRoomY: room.y,
      });
  }

  /**
   * Renders a door or wall depending on the height and if it there's a door
   * @param {number} h 
   * @param {boolean} hasDoor 
   * @returns {Tile}
   */
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
