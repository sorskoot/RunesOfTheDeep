/**
 * This file contains the Room class.
 */

type RoomDirections = {
  north: { x: number; y: number } | null | undefined;
  west: { x: number; y: number } | null | undefined;
  south: { x: number; y: number } | null | undefined;
  east: { x: number; y: number } | null | undefined;
};

import { findCharInStringArray } from "../forFramework/findCharInStringArray.js";
import { DirectionSymbol, Position2D } from "../types/index.js";
import { GenericItem } from "./objects/GenericItem.js";
import {container} from "tsyringe";

import {
  RoomTemplate,
  RoomTypes,
  chestDefinition,
} from "./roomTemplates.js";
import { RoomItemCreator } from "./roomItemCreator.js";


export class Room {
  
  /**
   * The rooms a door will take you to
   * @type {RoomDirections}
   */
  targetRooms: RoomDirections;

  /**
   * The template used to generate this room
   */
  #roomTemplate: RoomTemplate | null = null;

  /**
   * Does this room have a door in each direction?
   */
  doors: { north: boolean; west: boolean; south: boolean; east: boolean };

  /**
   * Is this room the exit, the final room of the game?
   */
  isExit: boolean;

  /**
   * Is this room the entrance, the first room of the game?
   */
  isEntrance: boolean;

  /**
   * Is this room a treasure room?
   */
  isTreasure: boolean;

  /**
   * The seed used to generate this room
   */
  seed: number;

  /**
   * When a room is visited for the first time, it is initialized
   * This means that the room is populated with items, enemies, etc, based on the chosen template
   * This is done to avoid having to generate the entire dungeon at once, while making
   * sure the room stays the same when revisited
   */
  isInitialized: boolean = false;

  /**
   * The distance from the entrance
   */
  distanceFromEntrance: number;

  chests?: chestDefinition[];
  items?: GenericItem[];

  roomItemCreator: RoomItemCreator;

  constructor() {
    this.roomItemCreator = container.resolve<RoomItemCreator>("RoomItemCreator");
    this.doors = { north: false, west: false, south: false, east: false };
    this.targetRooms = { north: null, west: null, south: null, east: null };
    this.isExit = false;
    this.isEntrance = false;
    this.isTreasure = false;
    this.seed = 0;
    this.distanceFromEntrance = 0;
  }

  toKey() {
    let key = "";
    if (this.doors.north) key += "N";
    if (this.doors.east) key += "E";
    if (this.doors.south) key += "S";
    if (this.doors.west) key += "W";
    return key;
  }

  /**
   * Gets the room in a specific direction
   * @param {DirectionSymbol|string} direction
   * @returns {{x:number, y:number}|null|undefined} the room in that direction; null if there is no room in that direction
   */
  getTargetRoom(direction: DirectionSymbol | string): Position2D | null | undefined {
    switch (direction) {
      case "N":
        return this.targetRooms.north;
      case "E":
        return this.targetRooms.east;
      case "S":
        return this.targetRooms.south;
      case "W":
        return this.targetRooms.west;
    }
  }

  /**
   *
   * @returns {RoomType} the type of the room
   */
  getRoomType() {
    if (this.isEntrance) {
      return RoomTypes.Entrance;
    }
    if (this.isExit) {
      return RoomTypes.Exit;
    }
    if (this.isTreasure) {
      return RoomTypes.Treasure;
    }
    return RoomTypes.Normal;
  }

  /**
   *
   * @param {RoomTemplate} roomTemplate
   */
  setRoomTemplate(roomTemplate: RoomTemplate) {
    if (this.#roomTemplate === null) {
      this.#roomTemplate = roomTemplate;
    } else {
      console.warn("RoomTemplate already set");
    }
  }

  getRoomTemplate() {
    return this.#roomTemplate;
  }

  /**
   * Gets the door in a specific direction from the template
   * @param {DirectionSymbol} direction
   * @returns {{x:number, y:number}}|null} the X/Y coordinates of the door; or null if there is no door in that direction
   */
  getDoor(direction: DirectionSymbol | string): { x: number; y: number } | null {
    // get the door from the template
    if (this.#roomTemplate !== null) {
      let result = findCharInStringArray(this.#roomTemplate.pattern, direction);
      return result;
    }
    return null;
  }

  initialize(template: RoomTemplate) {
    if (this.isInitialized) {
      // room is already initialized, probably because it was visited before
      return;
    }
    this.setRoomTemplate(template);
    this.items = this.roomItemCreator.createItems(template,this);
    this.isInitialized = true;
  }

  getItemsAtPosition(position: Position2D): GenericItem[] | undefined {
    if(!this.isInitialized){
      console.warn("Room is not initialized, but should since we are trying to get items from it");
      return; 
    }

    let items = this.items?.filter((item) => {
      return item.position.x === position.x && item.position.y === position.y;
    });

    return items;
  }
}
