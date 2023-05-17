export class Room {
  constructor() {
    this.doors = { north: false, west: false, south: false, east: false };
    this.targetRooms = { north: null, west: null, south: null, east: null };
    this.isExit = false;
    this.isEntrance = false;
    this.isTreasure = false;
    this.seed = 0;
  }

  toKey() {
    let key = "";
    if (this.doors.north) key += "N";
    if (this.doors.east) key += "E";
    if (this.doors.south) key += "S";
    if (this.doors.west) key += "W";
    return key;
  }

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
}
