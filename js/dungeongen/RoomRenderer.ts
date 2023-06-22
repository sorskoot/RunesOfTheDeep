/**
 * @file This file contains the RoomRenderer class.
 * @requires typedefs.js
 */

import { WonderlandEngine, Object3D, LightComponent } from "@wonderlandengine/api";
import { ObjectCache, Tags, cloneObject, rngWithWeight } from "@sorskoot/wonderland-components";
import { DoorHandler } from "../components/door-handler.js";
import { rng } from "@sorskoot/wonderland-components";
import { propDefinition, roomTemplates } from "./roomTemplates.js";
import { TileSet } from "./tileset.js";
import { Room } from "./room.js";
import { DirectionSymbol } from "../types/index.js";
import { Tile } from "./tile.js";
import { findCharInStringArray } from "../forFramework/findCharInStringArray.js";
import { container } from "tsyringe";
import { RoomCreator } from "./RoomCreator.js";

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
  roomCreator: RoomCreator;

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
    this.roomCreator = container.resolve(RoomCreator),
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
    

    if(!room.isInitialized){
    
      const possitbleTemplate = roomTemplates.filter((t) => t.type == room.getRoomType());
      let newTemplate = rng.getItem(possitbleTemplate);
      if (!newTemplate) {
        throw new Error(`No template found for room type ${room.getRoomType()}`);
      }
      
      this.roomCreator.setUpRoom(room, newTemplate);

      room.initialize(newTemplate);
    }
    
    let template = room.getRoomTemplate();

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
            case "1": // Character 1
            case "2": // Character 2
            case "3": // Character 3
            case "C": // Campfire, but floor or wall is rendered as well
            case "X": // Ememy, but floor or wall is rendered as well
            case "P": // Prop
            case "!": // Chest
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
              tile = this.#renderFloorOrWall(h, room.doors.north);
              break;
            case "E":
              tile = this.#renderFloorOrWall(h, room.doors.east);
              break;
            case "S":
              tile = this.#renderFloorOrWall(h, room.doors.south);
              break;
            case "W":
              tile = this.#renderFloorOrWall(h, room.doors.west);
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
          }
        }
      }
    }

    this.#addDoors(room, roomdesign);
    this.#setupLights(roomLights, room);
    this.#createInterior(room, roomdesign);
    this.#addCharacters(room, roomdesign);
  }

  #addDoors(room: Room, roomdesign: string[]) {
    if (room.doors.north) {
      let door = findCharInStringArray(roomdesign, "N")!;
      let tile = this.#tileset.getTileByName("Door")!;
      let newObj = this.createTile(door.x, 0, door.y, tile.object);
      newObj.rotateAxisAngleDegObject([0, 1, 0], 180);
      this.setupDoor(newObj, room.getTargetRoom("N"), "N");
    }

    if (room.doors.south) {
      let door = findCharInStringArray(roomdesign, "S")!;
      let tile = this.#tileset.getTileByName("Door")!;
      let newObj = this.createTile(door.x, 0, door.y, tile.object);
      this.setupDoor(newObj, room.getTargetRoom("S"), "S");
    }

    if (room.doors.east) {
      let door = findCharInStringArray(roomdesign, "E")!;
      let tile = this.#tileset.getTileByName("Door")!;
      let newObj = this.createTile(door.x, 0, door.y, tile.object);
      newObj.rotateAxisAngleDegObject([0, 1, 0], 90);
      this.setupDoor(newObj, room.getTargetRoom("E"), "E");
    }

    if (room.doors.west) {
      let door = findCharInStringArray(roomdesign, "W")!;
      let tile = this.#tileset.getTileByName("Door")!;
      let newObj = this.createTile(door.x, 0, door.y, tile.object);
      newObj.rotateAxisAngleDegObject([0, 1, 0], 270);
      this.setupDoor(newObj, room.getTargetRoom("W"), "W");
    }
  }

  #addCharacters(room: Room, roomdesign: string[]) {
    this.#tileset.resetAllCharacters();

    const roomTemplate = room.getRoomTemplate();

    if (!roomTemplate) {
      console.warn("`No room template found for current room");
      return; // can't do anything without a template.
    }

    if (!roomTemplate.characters || roomTemplate.characters.length == 0) {
      return; // no characters to add
    }

    let character1Pos = findCharInStringArray(roomdesign, "1");
    if (character1Pos) {
      const characterName = roomTemplate.characters![0];
      const character = this.#tileset.getCharacter(characterName);
      character?.setPositionWorld([character1Pos.x, 0.5, character1Pos.y]);
    }

    let character2Pos = findCharInStringArray(roomdesign, "2");
    if (character2Pos) {
      const characterName = roomTemplate.characters![1];
      const character = this.#tileset.getCharacter(characterName);
      character?.setPositionWorld([character2Pos.x, 0.5, character2Pos.y]);
    }

    let character3Pos = findCharInStringArray(roomdesign, "3");
    if (character3Pos) {
      const characterName = roomTemplate.characters![1];
      const character = this.#tileset.getCharacter(characterName);
      character?.setPositionWorld([character3Pos.x, 0.5, character3Pos.y]);
    }
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
   * Renders a floor tile when there's a doorway or wall depending on the height and if it there's a door or not
   * @param {number} h
   * @param {boolean} hasDoor
   * @returns {Tile}
   */
  #renderFloorOrWall(h: number, hasDoor: boolean): Tile | undefined {
    if (h === 0) {
      if (hasDoor) {
        const floorTile = this.#tileset.getTileByName("Floor01");
        if (!floorTile) {
          throw new Error("No floor tile found");
        }
        return floorTile;
      } else {
        const wallTile = this.#tileset.getTileByName("Wall01");
        if (!wallTile) {
          throw new Error("No wall tile found");
        }
        return wallTile;
      }
    } else if (h === 1) {
      if (!hasDoor) {
        const wallTile = this.#tileset.getTileByName("Wall01");
        if (!wallTile) {
          throw new Error("No wall tile found");
        }
        return wallTile;
      } else {
        return;
      }
    } else {
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
  #createInterior(room: Room, roomdesign: any) {
    const roomRNG = rng.clone().setSeed(1); //room.seed);

    let hasFirepit = false;

    for (let y = 0; y < roomdesign.length; y++) {
      for (let x = 0; x < roomdesign[y].length; x++) {
        let tile;
        let rotation = 0;
        switch (roomdesign[y][x]) {
          case "P": // prop
            // todo: use weighted random
            const props = room.getRoomTemplate()!.props;
            if (!props) {
              break;
            }
            const propChances = props.reduce((acc: Record<string, number>, p) => {
              acc[p.name] = p.chance ?? 1;
              return acc;
            }, {});
            let propname = roomRNG.getWeightedValue(propChances);
            const prop = props.find((p) => p.name === propname)!;
            tile = this.#tileset.getTileByName(prop.name);

            if (prop.mustBeAgainstWall) {
              if (
                roomdesign[y - 1][x] !== "#" &&
                roomdesign[y + 1][x] !== "#" &&
                roomdesign[y][x - 1] !== "#" &&
                roomdesign[y][x + 1] !== "#"
              ) {
                continue; // not next to a wall, skip the prop.
              }
            }

            if (prop.faceWall) {
              const directions = [
                { x: 0, y: -1, rotation: 180 },
                { x: 1, y: 0, rotation: 90 },
                { x: -1, y: 0, rotation: 270 },
                { x: 0, y: 1, rotation: 0 },
              ];
              let possibleRotations = [];
              for (const dir of directions) {
                if (roomdesign[y + dir.y][x + dir.x] === "#") {
                  possibleRotations.push(dir);
                }
              }
              if (possibleRotations.length > 0) {
                rotation = roomRNG.getItem(possibleRotations).rotation;
              }
            }
            break;
          case "C": // Campfire /Firepit
            if (!hasFirepit) {
              console.log("campfire");
              tile = this.#tileset.getTileByName("Firepit");
              hasFirepit = true;
            }
            break;
          case "!":
            const chests = room.getRoomTemplate()!.chests;
            if (!chests) {
              console.warn("No chests in room template, but there's a chest in the room design.");
              break;
            }
            const chestChances = chests.reduce((acc: Record<string, number>, p) => {
              acc[`Chest_${p.material}_${p.size}`] = p.chance ?? 1;
              return acc;
            }, {});
            let chestname = roomRNG.getWeightedValue(chestChances);

            const chest = chests.find(
              (c) => c.material === chestname!.split("_")[1] && c.size === chestname!.split("_")[2]
            )!;
            
            // add something to add loot to the chest.

            tile = this.#tileset.getTileByName(chestname!);
            rotation = chest.rotation;
            break;
          default:
            continue;
        }
        if (tile) {
          // only render a tile if we have a tile.
          let newObj = this.createTile(x, 0, y, tile.object);
          newObj.rotateAxisAngleDegObject([0, 1, 0], rotation);
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
