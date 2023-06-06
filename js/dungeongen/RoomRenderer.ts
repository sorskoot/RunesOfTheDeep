/**
 * @file This file contains the RoomRenderer class.
 * @requires typedefs.js
 */

import { WonderlandEngine, Object3D, LightComponent } from "@wonderlandengine/api";
import { ObjectCache, Tags, cloneObject } from "@sorskoot/wonderland-components";
import { DoorHandler } from "../components/door-handler.js";
import { rng } from "@sorskoot/wonderland-components";
import { roomTemplates } from "./roomTemplates.js";
import { TileSet } from "./tileset.js";
import { Room } from "./room.js";
import { DirectionSymbol } from "../types/index.js";
import { Tile } from "./tile.js";

/**
 * The Room Renderer is responsible for rendering a room.
 */
export class RoomRenderer {
  /**
   * A reference to the Wonderland Engine
   * @type {WonderlandEngine}
   */
  #engine: WonderlandEngine;

  /**
   * A reference to the parent of all objects in the room.
   * Generated objects will be a child of this object.
   * @type {Object3D}
   */
  #parent: Object3D;

  /**
   * A reference to the tileset
   * @type {TileSet}
   */
  #tileset: TileSet;

  /**
   * A reference to the lights objects that can be used in the room
   * @type {Object3D[]}
   */
  #lights: Object3D[];

  /**
   * A reference to the block cache
   * @type {ObjectCache}
   */
  #blockCache!: ObjectCache;

  /**
   * Instantiates a new RoomRenderer
   * @param {WonderlandEngine} engine
   * @param {Object3D} parent
   * @param {Object3D[]} lights
   * @param {TileSet} tileset
   * @param {ObjectCache} blockCache
   */
  constructor(
    engine: WonderlandEngine,
    parent: Object3D,
    tileset: TileSet,
    lights: Object3D[],
    blockCache: ObjectCache
  ) {
    this.#engine = engine;
    this.#parent = parent;
    this.#tileset = tileset;
    this.#lights = lights;
    this.#blockCache = blockCache;
  }

  /**
   * Renders a room
   * @param {Room} room The room to render
   */
  render(room: Room) {
    let template = room.getRoomTemplate();
    if (!template) {
      const possitbleTemplate = roomTemplates.filter((t) => t.type == room.getRoomType());
      template = rng.getItem(possitbleTemplate);
      if (!template) {
        throw new Error(`No template found for room type ${room.getRoomType()}`);
      }
      room.setRoomTemplate(template);
    }

    let roomLights = [];

    if (!template) {
      throw new Error(`No template found for room type ${room.getRoomType()}`);
    }

    const roomdesign = template.pattern;
    if (!roomdesign) {
      throw new Error(`No room design found for room type ${room.getRoomType()}`);
    }

    for (let y = 0; y < roomdesign.length; y++) {
      for (let x = 0; x < roomdesign[y].length; x++) {
        for (let h = 0; h < template.ceilingHeight[0]; h++) {
          let tile;
          switch (roomdesign[y][x]) {
            case "#":
              tile = this.#tileset.getTileByName("Wall01");
              break;
            case "%": // Light, but floor or wall is rendered as well
              if (h == 0) {
                // only store light once
                roomLights.push([x, h, y]);
              }
            case "C": // Campfire, but floor or wall is rendered as well
            case "X": // Ememy, but floor or wall is rendered as well
            case ".":
              if (h == 0) {
                tile = this.#tileset.getTileByName("Floor01");
              } else if (h == template.ceilingHeight[0] - 1) {
                tile = this.#tileset.getTileByName("Ceiling01");
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
            let newObj = this.createTile(x, h, y, tile.object);
            if (!newObj) {
              console.warn(`No object found for tile ${tile.name}`);
              continue;
            }
            let tags = newObj.getComponent(Tags);
            if (tags && tags.hasTag("Door")) {
              this.setupDoor(
                newObj,
                room.getTargetRoom(roomdesign[y][x]),
                roomdesign[y][x] as DirectionSymbol
              );
            }
          }
        }
      }
    }
    this.#setupLights(roomLights, room);
    this.createInterior(room, roomdesign);
  }

  /**
   * Setup the scripts for the door, adding a new one if needed.
   * @param {Object3D} newObj the newly created object (the door)
   * @param {*} room
   * @param {DirectionSymbol} direction
   */
  setupDoor(newObj: Object3D, room: any, direction: DirectionSymbol) {
    let oldComp = newObj.getComponent(DoorHandler);
    if (oldComp) {
      oldComp.direction = direction;
      oldComp.targetRoomX = room.x;
      oldComp.targetRoomY = room.y;
      oldComp.active = true;
    } else
      newObj.addComponent(DoorHandler, {
        direction: direction,
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
  #renderDoorOrWall(h: number, hasDoor: boolean): Tile {
    if (h === 0) {
      if (hasDoor) {
        const doorTile = this.#tileset.getTileByName("Door");
        if (!doorTile) {
          throw new Error("No door tile found");
        }
        return doorTile;
      } else {
        const wallTile = this.#tileset.getTileByName("Wall01");
        if (!wallTile) {
          throw new Error("No wall tile found");
        }
        return wallTile;
      }
    } else if (h === 1 && !hasDoor) {
      const wallTile = this.#tileset.getTileByName("Wall01");
      if (!wallTile) {
        throw new Error("No wall tile found");
      }
      return wallTile;
    } else  {
      const wallTile = this.#tileset.getTileByName("Wall01");
      if (!wallTile) {
        throw new Error("No wall tile found");
      }
      return wallTile;
    } 
  }

  /**
   * Sets up the lights in a room
   * @param {number[][]} roomLights
   * @param {*} room
   */

  #setupLights(roomLights: number[][], room: any) {
    for (let index = 0; index < this.#lights.length; index++) {
      const light = this.#lights[index];
      light.resetPositionRotation();
      if (roomLights[index]) {
        light.getComponent(LightComponent)!.active = true;
        light.setPositionWorld([roomLights[index][0], 2, roomLights[index][2]]);
      } else {
        light.getComponent(LightComponent)!.active = false;
      }
    }
    this.#lights;
  }

  /**
   * Creates the interior of a room
   * @param {Room} room
   * @param {*} roomdesign
   */
  createInterior(room: Room, roomdesign: any) {
    const roomRNG = rng.clone().setSeed(room.seed);

    let hasFirepit = false;

    for (let y = 0; y < roomdesign.length; y++) {
      for (let x = 0; x < roomdesign[y].length; x++) {
        let tile;
        switch (roomdesign[y][x]) {
          case "C": // Campfire /Firepit
            if (!hasFirepit) {
              console.log("campfire");
              tile = this.#tileset.getTileByName("Firepit");
              hasFirepit = true;
            }
            break;
          default:
            continue;
        }
        if (tile) {
          // only render a tile if we have a tile.
          let newObj = this.createTile(x, 0, y, tile.object);
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
  createTile(x: number, y: number, z: number, tile: Object3D) {
    let blockObj = tile;
    let obj = cloneObject(this.#engine, blockObj, this.#blockCache);
    if (!obj) {
      throw new Error("Cloning object failed");
    }
    obj.resetPositionRotation();
    obj.setPositionWorld([x, y, z]);
    return obj;
  }
}
