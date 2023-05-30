export const RoomTypes = {
    Entrance: "entrance",
    Exit: "exit",
    Treasure: "treasure",
    Normal: "normal",
}

export class RoomTemplate{
    /**
     * @description the name of the room
     * @type {string} name
     */
    name;
    /**
     * @description the type of the room
     * @type {RoomTypes} type
     */
    type;
    /**
     * @description the pattern of the room
     * @type {string[]} pattern
     */
    pattern;
    /**
     * @description the height of the ceiling in tiles, randomly chosen from this array 
     * @type {number[]} ceilingHeight
     */
    ceilingHeight;
    /**
     * @description whether or not this room can be rotated
     * @type {boolean} canBeRotated
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
        ceilingHeight: [3],
        canBeRotated: false,
        pattern: [
            " #####N##### ",
            "#.C........C#",
            "#...........#",
            "#..........# ",
            "#..........# ",
            "W...........E",
            "#C........CC#",
            "#...........#",
            "##..........#",
            "  ##........#",
            "    #S###### "
        ]
    },
    {
        name: "normal",
        type: RoomTypes.Normal,
        ceilingHeight: [2,3],
        canBeRotated: true,
        pattern: [
            " #N#   ",
            " #..## ",
            "#X...X#",
            "W......E",
            "#....X#",
            " #S### "
        ]
    }
]

export const RoomTemplatePatternDefinitions = {
    "N": { // Door to the north
    },
    "E": { // Door to the east
    },
    "S": { // Door to the south
    },
    "W": { // Door to the west
    },
    "C": { // Campfire
    },
    ".": { // Empty space
    },
    "#": { // Wall
    },
    "%": { // Wall with Torch
    },
    "X":{// Enemy
    },
    "!":{// Something special. Is decided based on the biome and the room type
    },
    "P":{// Prop
    },
    "O":{// Ore
    },
    "G":{// Gem
    },
}
