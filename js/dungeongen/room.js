/**
 * @file This file contains the Room class.
 * @requires typedefs.js
 *
 * @typedef {Object} RoomDirections - The rooms a door will take you to
 * @property {Room|null|undefined} north The room in the north direction
 * @property {Room|null|undefined} east The room in the east direction
 * @property {Room|null|undefined} south The room in the south direction
 * @property {Room|null|undefined} west The room in the west direction
 */

import { RoomTypes } from "./roomTemplates";

export class Room {

  /**
   * The rooms a door will take you to
   * @type {RoomDirections}
   */
  targetRooms;

  constructor() {
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
   * @returns {Room|undefined|null} the room in that direction; null if there is no room in that direction
   */
  getTargetRoom(direction) {
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
  getRoomType(){
    if(this.isEntrance){
      return RoomTypes.Entrance;
    }
    return RoomTypes.Normal;
  }
}
