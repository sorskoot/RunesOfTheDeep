import rng from "@sorskoot/wonderland-components/src/utils/rng";
import { Cell } from "./cell";
import { TileSet } from "./tileset";
import { Tile } from "./tile";
import { Queue } from "../forFramework/queue.js";
import { getInvertedDirection, getNeighbors } from "./utils/gridHelpers";
import { deepClone } from "./utils/deepClone";

const DIRECTION_OFFSETS = {
  north: { x: 0, y: 1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: -1 },
  west: { x: -1, y: 0 },
};

export class Grid {
  sizeX;
  sizeY;

  /**
   * The grid of cells that make up the level.
   * @type {Cell[][]}
   */
  #grid = [[]];

  patterns;

  constraints;

  constructor(sizeX, sizeY, tileSet, extractedPatterns, constraintMappingForAllKeySets) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;

    this.patterns = extractedPatterns;
    this.constraints = constraintMappingForAllKeySets;
    this.#createGrid();
  }

  debug() {
    // remove Y layer but keep X and Z
    let grid2D = this.#grid.map((x) => x.map((y) => y.map((t) => t.possiblePatterns)));

    console.table(grid2D);
  }

  #createGrid() {
    this.#grid = new Array(this.sizeX);

    for (let x = 0; x < this.sizeX; x++) {
      this.#grid[x] = new Array(this.sizeY);
      for (let y = 0; y < this.sizeY; y++) {
        this.#grid[x][y] = new Room();
      }
    }

    return this.#grid;
  }

  /**
   * Gets a cell from the grid at the given indices.
   * @param {number} x X-index of the cell
   * @param {number} y Y-index of the cell
   * @returns {Cell} The cell at the given indices
   */
  getCell(x, y) {
    return this.#grid[x][y];
  }

  /**
   * Gets the pattern at the given index from the list of patterns.
   * @param {number} index The index of the pattern to get.
   * @returns {Tile} The pattern at the given index.
   */
  getPattern(index) {
    return this.patterns[index];
  }

  collapse() {
    let entropyCells = this.#getLowestEntropyCells();
    if (!entropyCells.length) {
      return true; // all cells are collapsed
    }

    let picked = rng.getItem(entropyCells);

    const cell = this.#grid[picked.x][picked.y];

    if (!cell.isCollapsed && cell.possiblePatterns.length === 0) {
      // we have a contradiction
      return true;
    }

    // collapse the cell and propage the constraints with backtracking
    let done = false;
    let count = 0;
    do {
      count++;
      // create a backup of the grid
      const backup = deepClone(this.#grid);

      cell.collapse(this.patterns);

      done = this.propagate(this.#grid, picked);

      if (!done) {
        // revert
        console.log("Failed to propagate, reverting...");
        this.#grid = backup;
      }
    } while (!done && count < 25);

    for (let x = 0; x < this.#grid.length; x++) {
      for (let y = 0; y < this.#grid[x].length; y++) {
        const cell = this.#grid[x][y];
        if (cell.calculateEntropy(this.patterns) === 1) {
          cell.collapse(this.patterns);
        }
      }
    }
    return false;
  }

  #getLowestEntropyCells() {
    let minEntropy = Infinity;
    let lowestEntropyCells = [];

    for (let x = 0; x < this.#grid.length; x++) {
      for (let y = 0; y < this.#grid[x].length; y++) {
        const cell = this.#grid[x][y];
        if (cell.isCollapsed) {
          continue; // skip collapsed cells
        }
        const entropy = cell.calculateEntropy(this.patterns);
        if (entropy < minEntropy) {
          minEntropy = entropy;
          lowestEntropyCells = [{ x, y, entropy }];
        } else if (entropy === minEntropy) {
          lowestEntropyCells.push({ x, y, entropy });
        }
      }
    }
    return lowestEntropyCells;
  }

  calculateConstrainedPatterns(current, neighbor) {
    const currentCell = this.getCell(current.x, current.y);
    const currentOptions = currentCell.possiblePatterns;
    const neighborCell = this.getCell(neighbor.x, neighbor.y);
    const neighborOptions = neighborCell.possiblePatterns;
    const constrainedPatternsSet = new Set();

    for (let i = 0; i < currentOptions.length; i++) {
      const currentTileIndex = currentOptions[i];
      const currentTileConstraints = this.constraints.get(currentTileIndex);
      if (currentTileConstraints.hasOwnProperty(neighbor.name)) {
        for (let j = 0; j < neighborOptions.length; j++) {
          const neighborTileIndex = neighborOptions[j];
          if (currentTileConstraints[neighbor.name].includes(neighborTileIndex)) {
            constrainedPatternsSet.add(neighborOptions[j]);
          }
        }
      }
    }

    return Array.from(constrainedPatternsSet);
  }

  hasChangesInPossiblePatterns(neighbor, constrainedPatterns) {
    const neighborCell = this.getCell(neighbor.x, neighbor.y);
    const neighborOptions = neighborCell.possiblePatterns;
    const hasChanges = neighborOptions.length !== constrainedPatterns.length;
    return hasChanges;
  }

  updatePossiblePatterns(neighbor, constrainedPatterns) {
    const neighborCell = this.getCell(neighbor.x, neighbor.y);
    neighborCell.possiblePatterns = constrainedPatterns;
    if (constrainedPatterns.length === 1) {
      neighborCell.collapse(this.patterns);
    }
  }

  noValidOptionsLeft(neighbor) {
    const neighborCell = this.getCell(neighbor.x, neighbor.y);
    const neighborOptions = neighborCell.possiblePatterns;
    return neighborOptions.length === 0;
  }

  /**
   * propagates the constraints to the neighbors of the current cell
   * @param {*} grid
   * @param {*} currentPosition
   */
  propagate(grid, currentPosition) {
    const queue = new Queue();
    queue.enqueue(currentPosition);

    const patternSize = 3; // Set this according to your requirements
    let counter = 0;
    while (!queue.isEmpty()) {
      counter++;
      if (counter > 50) {
        return true;
      }
      const position = queue.dequeue();

      for (let directionOffset in DIRECTION_OFFSETS) {
        const offsetX = DIRECTION_OFFSETS[directionOffset].x;
        const offsetY = DIRECTION_OFFSETS[directionOffset].y;

        const neighborX = position.x + offsetX;
        const neighborY = position.y + offsetY;

        if (
          neighborX < 0 ||
          neighborY < 0 ||
          neighborY >= grid.length ||
          neighborX >= grid.length
        ) {
          continue;
        }
        let neighborPosition = { x: neighborX, y:  neighborY, name: directionOffset };

        const constrainedPatterns = this.calculateConstrainedPatterns(position, neighborPosition);
        if (constrainedPatterns.length === 0) {
          console.log("Contradiction found, impossible constraint");
          return false;
        }
        if (this.hasChangesInPossiblePatterns(neighborPosition, constrainedPatterns)) {
          this.updatePossiblePatterns(neighborPosition, constrainedPatterns);

          const cellNeighbor = this.getCell(neighborPosition.x, neighborPosition.y);

          if (!cellNeighbor.isCollapsed) {
            if (this.noValidOptionsLeft(neighborPosition)) {
              // Handle contradiction according to your approach (backtrack, restart)
              console.log("Contradiction found");
              //  return false;
            } else {
              queue.enqueue(neighborPosition);
            }
          }
        }
      }
    }
    return true;
  }

  getDirectionNameFromOffsets(offsetX, offsetY) {
    const absMaxOffset = Math.max(Math.abs(offsetX), Math.abs(offsetY));

    const normalizedOffsetX = offsetX / absMaxOffset;
    const normalizedOffsetY = offsetY / absMaxOffset;

    if (normalizedOffsetY === -1) {
      return "north";
    } else if (normalizedOffsetY === 1) {
      return "south";
    }

    if (normalizedOffsetX === -1) {
      return "west";
    } else if (normalizedOffsetX === 1) {
      return "east";
    }

    return directionName || null;
  }

  /**
   *
   * @param {{x:number, y:number}} position
   * @returns
   */
  findUncollapsedNeighbors(position) {
    let neighbors = getNeighbors(this, position);
    return neighbors.filter(
      (neighbor) => !this.getCell(neighbor.x, neighbor.y).isCollapsed
    );
  }

  generateMaze(width, height) {
    const maze = new Array(height)
      .fill(null)
      .map(() => new Array(width).fill(null).map(() => new Room()));
  
    function removeWall(x1, y1, x2, y2) {
      if (x1 === x2) {
        if (y1 > y2) {
          maze[y1][x1].doors.top = false;
          maze[y2][x2].doors.bottom = false;
        } else {
          maze[y1][x1].doors.bottom = false;
          maze[y2][x2].doors.top = false;
        }
      } else {
        if (x1 > x2) {
          maze[y1][x1].doors.left = false;
          maze[y2][x2].doors.right = false;
        } else {
          maze[y1][x1].doors.right = false;
          maze[y2][x2].doors.left = false;
        }
      }
    }
  
    function isValidCoordinates(x, y) {
      return x >= 0 && x < width && y >= 0 && y < height;
    }
  
    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    function generateMazeRecursively(x, y, visitedList) {
      visitedList.push(`${x},${y}`);
    
      const directions = [
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 },
      ];
    
      shuffleArray(directions);
    
      for (const dir of directions) {
        const newX = x + dir.dx;
        const newY = y + dir.dy;
    
        if (
          isValidCoordinates(newX, newY) &&
          !visitedList.includes(`${newX},${newY}`)
        ) {
          removeWall(x, y, newX, newY);
          generateMazeRecursively(newX, newY, visitedList);
        }
      }
    }
  }
}
