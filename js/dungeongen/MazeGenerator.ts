import { Tile } from "./tile.js";
import { Room } from "./room.js";
import { shuffleArray } from "@sorskoot/wonderland-components";

const DIRECTION_OFFSETS = {
  north: { x: 0, y: 1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: -1 },
  west: { x: -1, y: 0 },
};

export class MazeGenerator {
  mazeWidth;
  mazeHeight;

  /**
   * The grid of rooms that make up the level.
   * @type {Room[][]}
   */
  maze: Room[][] = [[]];

  patterns: { [x: string]: any };

  constraints: any;
  farthestRoom: { x: number; y: number; distance: number };

  constructor(
    sizeX: number,
    sizeY: number,
    tileSet = null,
    extractedPatterns = [],
    constraintMappingForAllKeySets = null
  ) {
    this.mazeWidth = sizeX;
    this.mazeHeight = sizeY;

    this.patterns = extractedPatterns;
    this.constraints = constraintMappingForAllKeySets;
    this.#createGrid();

    this.farthestRoom = { x: 0, y: 0, distance: 0 };
  }

  #createGrid() {
    this.maze = new Array(this.mazeWidth);

    for (let x = 0; x < this.mazeWidth; x++) {
      this.maze[x] = new Array(this.mazeHeight);
      for (let y = 0; y < this.mazeHeight; y++) {
        this.maze[x][y] = new Room();
      }
    }
    return this.maze;
  }

  /**
   * Gets a room from the grid at the given indices.
   * @param {number} x X-index of the room
   * @param {number} y Y-index of the room
   * @returns {Room} The room at the given indices
   */
  getRoom(x: number, y: number): Room {
    return this.maze[x][y];
  }

  /**
   * Gets the pattern at the given index from the list of patterns.
   * @param {number} index The index of the pattern to get.
   * @returns {Tile} The pattern at the given index.
   */
  getPattern(index: number): Tile {
    return this.patterns[index];
  }

  enableDoors(x1: number, y1: number, x2: number, y2: number, direction: string) {
    switch (direction) {
      case "north":
        this.maze[x1][y1].doors.north = true;
        this.maze[x1][y1].targetRooms.north = { x: x2, y: y2 };
        this.maze[x2][y2].doors.south = true;
        this.maze[x2][y2].targetRooms.south = { x: x1, y: y1 };
        break;
      case "east":
        this.maze[x1][y1].doors.east = true;
        this.maze[x1][y1].targetRooms.east = { x: x2, y: y2 };
        this.maze[x2][y2].doors.west = true;
        this.maze[x2][y2].targetRooms.west = { x: x1, y: y1 };
        break;
      case "south":
        this.maze[x1][y1].doors.south = true;
        this.maze[x1][y1].targetRooms.south = { x: x2, y: y2 };
        this.maze[x2][y2].doors.north = true;
        this.maze[x2][y2].targetRooms.north = { x: x1, y: y1 };
        break;
      case "west":
        this.maze[x1][y1].doors.west = true;
        this.maze[x1][y1].targetRooms.west = { x: x2, y: y2 };
        this.maze[x2][y2].doors.east = true;
        this.maze[x2][y2].targetRooms.east = { x: x1, y: y1 };
        break;
    }
  }

  isValidCoordinates(x: number, y: number) {
    return x >= 0 && x < this.mazeWidth && y >= 0 && y < this.mazeHeight;
  }

  generate() {
    this.#generateMazeRecursively(0, 0);
    this.getRoom(this.farthestRoom.x, this.farthestRoom.y).isExit = true;
    this.getRoom(0, 0).isEntrance = true;
    console.log(`distance:${this.farthestRoom.distance}`);
  }
  /**
   * Generates a maze using the recursive backtracking algorithm.
   * @param {number} x Start X coordinate
   * @param {number} y Start Y coordinate
   * @param {string[]} visitedList The list of visited rooms, omit to start a new list.
   */
  #generateMazeRecursively(x: number, y: number, visitedList: string[] = [], distance = 0) {
    if (!visitedList) {
      visitedList = [];
    }
    visitedList.push(`${x},${y}`);

    const directions = [
      { dx: -1, dy: 0, direction: "north" },
      { dx: 1, dy: 0, direction: "south" },
      { dx: 0, dy: -1, direction: "west" },
      { dx: 0, dy: 1, direction: "east" },
    ];

    shuffleArray(directions as []);

    const currentRoom = this.getRoom(x, y);
    currentRoom.distanceFromEntrance = distance;

    if (distance % 10 == 0) {
      currentRoom.isTreasure = true;
    }

    for (const dir of directions) {
      if (!dir) continue; // Weird, we should never get here, but we do.
      const newX = x + dir.dx;
      const newY = y + dir.dy;

      if (this.isValidCoordinates(newX, newY) && !visitedList.includes(`${newX},${newY}`)) {
        this.enableDoors(x, y, newX, newY, dir.direction);

        if (distance > this.farthestRoom.distance) {
          this.farthestRoom.x = newX;
          this.farthestRoom.y = newY;
          this.farthestRoom.distance = distance;
        }

        this.#generateMazeRecursively(newX, newY, visitedList, distance + 1);
      }
    }
  }
}
