export class Room {
  constructor() {
    this.doors = { north: false, west: false, south: false, east: false };
    this.isExit = false;
    this.isEntrance = false;
    this.isTreasure = false;
  }

  toKey() {
    let key = "";
    if (this.doors.north) key += "N";
    if (this.doors.east) key += "E";
    if (this.doors.south) key += "S";
    if (this.doors.west) key += "W";
    return key;
  }
}
