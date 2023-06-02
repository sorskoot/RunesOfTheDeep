/**
 * @file This file contains the RoomRenderer class.
 * @requires typedefs.js
 */

export const RoomTypes = {
  Entrance: /** @type {RoomType} */ ("entrance"),
  Exit: /** @type {RoomType} */ ("exit"),
  Treasure: /** @type {RoomType} */ ("treasure"),
  Normal: /** @type {RoomType} */ ("normal"),
};

export class RoomTemplate {
  /**
   * @description the name of the room
   * @type {string | undefined} name
   */
  name;
  /**
   * @description the type of the room
   * @type {RoomType | undefined} type
   */
  type;
  /**
   * @description the pattern of the room
   * @type {string[] | undefined} pattern
   */
  pattern;
  /**
   * @description the height of the ceiling in tiles, randomly chosen from this array
   * @type {number[]} ceilingHeight
   */
  ceilingHeight = [2];
  /**
   * @description whether or not this room can be rotated
   * @type {boolean | undefined} canBeRotated
   */
  canBeRotated;
}

/**
 * The room templates. When a room of a certain type is needed,
 * a random room template of that type is chosen and it is rotated if necessary.
 * @type {RoomTemplate[]}
 */
export const roomTemplates = [
  {
    name: "entrance",
    type: RoomTypes.Entrance,
    ceilingHeight: [4],
    canBeRotated: false,
    pattern: [
      " #####N##### ",
      "#.C........C#",
      "#.........%.#",
      "#..........# ",
      "#..%.......# ",
      "W...........E",
      "#C........CC#",
      "#...........#",
      "##.....%....#",
      "  ##........#",
      "    #S###### ",
    ],
  },
  {
    name: "normal",
    type: RoomTypes.Normal,
    ceilingHeight: [3, 4],
    canBeRotated: true,
    pattern: [
        " #N#   ", 
        " #..## ", 
        "#X...X#", 
        "W..%...E", 
        "#....X#", 
        " #S### "],
  },
  {
    name: "normal",
    type: RoomTypes.Normal,
    ceilingHeight: [3, 4],
    canBeRotated: true,
    pattern: [
      "#####    ",
      "#.X.#N###",
      "#.%.....E",
      "#.......#",
      "#.......#",
      "W.....%.#",
      "#.......#",
      "#S#######",
    ],
  },
  {
    name: "normal",
    type: RoomTypes.Normal,
    ceilingHeight: [3, 4],
    canBeRotated: true,
    pattern: [
      "##N###    ",
      "#..%.#####",
      "#X.......E",
      "#........#",
      " #...#####",
      " W.%.# ",
      " #...# ",
      " ##S## ",
    ],
  },
];

export const RoomTemplatePatternDefinitions = {
  N: {
    // Door to the north
  },
  E: {
    // Door to the east
  },
  S: {
    // Door to the south
  },
  W: {
    // Door to the west
  },
  C: {
    // Campfire( max 1 per room)
  },
  ".": {
    // Empty space
  },
  "#": {
    // Wall
  },
  "%": {
    // Torch (light)
  },
  X: {
    // Enemy
  },
  "!": {
    // Something special. Is decided based on the biome and the room type
  },
  P: {
    // Prop
  },
  O: {
    // Ore
  },
  G: {
    // Gem
  },
};
