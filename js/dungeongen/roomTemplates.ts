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
  chests?: chestDefinition[];
}

export interface propDefinition {
  name: string;
  chance?: number;
  faceWall?: boolean;
  mustBeAgainstWall?: boolean;
}

export interface chestDefinition {
  chance?: number;
  material: "Iron"|"Gold",
  size: "None"|"Small"|"Medium"|"Large"
  rotation: 0|90|180|270;
  loottable?: string;
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
      "##P....%!.PP#",
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
    ],
    chests:[
      {material:"Iron", size:"Large", rotation:270},
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
    ceilingHeight: [5, 8],
    canBeRotated: true,
    pattern: [
        "    #N#", 
        "   #...#", 
        "  #.....#", 
        " #.......#", 
        "#.........#", 
        "W....%....E",
        "#.........#",
        " #.......#",  
        "  #.....#", 
        "   #...#", 
        "    #S#"],
        
  },
  {
    name: "normal",
    type: RoomTypes.Normal,
    ceilingHeight: [5],
    canBeRotated: true,
    pattern: [        
        " ####N####", 
        "#.........#",
        "#.........#",
        "#..P...P..#",
        "#.........#",
        "W....%....E",
        "#.........#",
        "#..P...P..#",
        "#.........#",
        "#.........#",
        " ####S####"],
    props:[
      {name:"Pillar"},
    ]
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
interface RoomTemplatePattern{
  canTeleportToTile:boolean;
  canInteractWithTile:boolean;
  behavior?: "Door"|"Chest"|"Ore";
}

export const RoomTemplatePatternDefinitions:Record<string, RoomTemplatePattern> = {
  N: {
    canTeleportToTile:false,
    canInteractWithTile:true,
    behavior: "Door",
    // Door to the north
  },
  E: {
    canTeleportToTile:false,
    canInteractWithTile:true,
    behavior: "Door",
    // Door to the east
  },
  S: {
    canTeleportToTile:false,
    canInteractWithTile:true,
    behavior: "Door",
    // Door to the south
  },
  W: {
    canTeleportToTile:false,
    canInteractWithTile:true,
    behavior: "Door",
    // Door to the west
  },
  C: {
    canTeleportToTile:false,
    canInteractWithTile:false,
    // Campfire( max 1 per room)
  },
  ".": {
    // Empty space
    canTeleportToTile:true,
    canInteractWithTile:false,
  },
  "#": {
    canTeleportToTile:false,
    canInteractWithTile:false,
    // Wall
  },
  "%": {
    canTeleportToTile:true,
    canInteractWithTile:false,
    // Torch (light)
  },
  X: {
    // Enemy spawn point
    canTeleportToTile:true,
    canInteractWithTile:false,
  },
  "!": {
    // A chest, details defined in the room definition
    canTeleportToTile:false,
    canInteractWithTile:true,
    behavior: "Chest"
  },
  P: {
    // Prop
    canTeleportToTile:false,
    canInteractWithTile:false,
  },
  O: {
    // Ore
    canTeleportToTile:false,
    canInteractWithTile:true,
    behavior:"Ore"
  },
  G: {
    canTeleportToTile:false,
    canInteractWithTile:true,
    // Gem
  },
};
