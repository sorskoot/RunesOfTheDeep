/**
 * @file This file contains the RoomRenderer class.
 * @requires typedefs.js
 */

import { RoomType } from "../types/index.js";

export const RoomTypes: Record<string, RoomType> = {
  Entrance: "entrance",
  Exit: "exit",
  Treasure: "treasure",
  Normal: "normal",
};

export interface RoomTemplate {
  
  /**
   * @description the name of the room
   * @type {string | undefined} name
   */
  name: string;
  /**
   * @description the type of the room
   * @type {RoomType | undefined} type
   */
  type: RoomType;
  /**
   * @description the pattern of the room
   * @type {string[] | undefined} pattern
   */
  pattern: string[];
  /**
   * @description the height of the ceiling in tiles, randomly chosen from this array
   * @type {number[]} ceilingHeight
   */
  ceilingHeight: number[];
  /**
   * @description whether or not this room can be rotated
   * @type {boolean | undefined} canBeRotated
   */
  canBeRotated: boolean;

  /**
   * The characters that are spawned in this room.
   * On the template they are represented by a number corresponding 
   * to the index in the characters array.
   */
  characters?: string[];

  /**
   * The props that are spawned in this room. 
   * Props will be placed random whereever there's a P on the template. 
   */ 
  props?: propDefinition[];
}

export interface propDefinition {
  name: string;
  chance?: number;
  faceWall?: boolean;
  mustBeAgainstWall?: boolean;
}

/**
 * The room templates. When a room of a certain type is needed,
 * a random room template of that type is chosen and it is rotated if necessary.
 * @type {RoomTemplate[]}
 */
export const roomTemplates: RoomTemplate[] = [
  {
    name: "entrance",
    type: RoomTypes.Entrance,
    ceilingHeight: [4],
    canBeRotated: false,
    pattern: [
      " #####N##### ",
      "#PP.......PP#",
      "#P..%.....%P#",
      "#P.1.C.....# ",
      "#.....%....##",
      "W...........E",
      "#P..........#",
      "#P.......2.P#",
      "##P....%..PP#",
      "  ##....PPPP#",
      "    #S###### ",
    ],
    characters: [
      "LittleDude",
      "MagicDude"
    ],
    props:[
      {name:"Barrel"},
      {name:"BarrelBroken", chance:0.4},
      {name:"Bench",faceWall:true, chance:0.1},
      {name:"Banner",faceWall:true, chance:0.3, mustBeAgainstWall:true},
    ]
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
  },{
    name: "Final room",
    type: RoomTypes.Exit,
    ceilingHeight: [4],
    canBeRotated: false,
    pattern: [
      "#N#########",
      "W..%......#",
      "#.........#",
      "#.........#",
      "#..%...%..#",
      "#.........#",
      "#.........#",
      "#......%..E",
      "#########S#",
    ],
  },{
    name: "Treasure Room",
    type: RoomTypes.Treasure,
    ceilingHeight: [3],
    canBeRotated: false,
    pattern: [
      "#N#########",
      "W..%..#...#",
      "#.....#...#",
      "#.....#...#",
      "#..%...%..#",
      "#...#.....#",
      "#...#.....#",
      "#...#..%..E",
      "#########S#",
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
