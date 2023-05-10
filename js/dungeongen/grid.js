import rng from "@sorskoot/wonderland-components/src/utils/rng";
import { Cell } from "./cell";
import { TileSet } from "./tileset";
import { Tile } from "./tile";
import { Queue } from "../forFramework/queue.js";
import { getInvertedDirection, getNeighbors } from "./utils/gridHelpers";
import { deepClone } from "./utils/deepClone";

const DIRECTION_OFFSETS = {
  north: { x: 0, y: 0, z: 1 },
  east: { x: 1, y: 0, z: 0 },
  south: { x: 0, y: 0, z: -10 },
  west: { x: -1, y: 0, z: 0 },
  // up: { x: 0, y: 1, z: 0 },
  // down: { x: 0, y: -1, z: 0 },
};

export class Grid {
  sizeX;
  sizeY;
  sizeZ;

  /**
   * The entire tileset to use for the level.
   * @type {TileSet}
   */
  #tileSet_TO_BE_REMOVED_AND_REPLACED;

  /**
   * The grid of cells that make up the level.
   * @type {Cell[][][]}
   */
  #grid = [[[]]];

  patterns;

  constraints;

  constructor(sizeX, sizeY, sizeZ, tileSet, extractedPatterns, constraintMappingForAllKeySets) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.sizeZ = sizeZ;
    this.#tileSet_TO_BE_REMOVED_AND_REPLACED = tileSet;

    this.patterns = extractedPatterns;
    this.constraints = constraintMappingForAllKeySets;
    this.#createGrid();
  }

  debug() {
    // remove Y layer but keep X and Z
    let grid2D = this.#grid.map((x) =>
      x.map((y) => y.map((z) => z).map((t) => t.possiblePatterns))
    );

    console.table(grid2D);
  }

  #createGrid() {
    this.#grid = new Array(this.sizeX);

    for (let x = 0; x < this.sizeX; x++) {
      this.#grid[x] = new Array(this.sizeY);

      for (let y = 0; y < this.sizeY; y++) {
        this.#grid[x][y] = new Array(this.sizeZ);

        for (let z = 0; z < this.sizeZ; z++) {
          // Initialize the cell at [x][y][z] with default value, e.g., null or an object.
          this.#grid[x][y][z] = new Cell(this.patterns.length);
        }
      }
    }

    return this.#grid;
  }

  /**
   * Gets a cell from the grid at the given indices.
   * @param {number} x X-index of the cell
   * @param {number} y Y-index of the cell
   * @param {number} z Z-index of the cell
   * @returns {Cell} The cell at the given indices
   */
  getCell(x, y, z) {
    return this.#grid[x][y][z];
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

    const cell = this.#grid[picked.x][picked.y][picked.z];

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
        for (let z = 0; z < this.#grid[x][y].length; z++) {
          const cell = this.#grid[x][y][z];
          if (cell.calculateEntropy(this.patterns) === 1) {
            cell.collapse(this.patterns);
          }
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
        for (let z = 0; z < this.#grid[x][y].length; z++) {
          const cell = this.#grid[x][y][z];
          if (cell.isCollapsed) {
            continue; // skip collapsed cells
          }
          const entropy = cell.calculateEntropy(this.patterns);
          if (entropy < minEntropy) {
            minEntropy = entropy;
            lowestEntropyCells = [{ x, y, z, entropy }];
          } else if (entropy === minEntropy) {
            lowestEntropyCells.push({ x, y, z, entropy });
          }
        }
      }
    }

    return lowestEntropyCells;
  }

  /**
    
   currentOptions = [1]
   neighborOptions = [1,2,3]

   constraints for 1 are [1,2]


   
   */

  calculateConstrainedPatterns(current, neighbor) {
    const currentCell = this.getCell(current.x, current.y, current.z);
    const currentOptions = currentCell.possiblePatterns;
    const neighborCell = this.getCell(neighbor.x, neighbor.y, neighbor.z);
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
    const neighborCell = this.getCell(neighbor.x, neighbor.y, neighbor.z);
    const neighborOptions = neighborCell.possiblePatterns;
    const hasChanges = neighborOptions.length !== constrainedPatterns.length;
    return hasChanges;
  }

  updatePossiblePatterns(neighbor, constrainedPatterns) {
    const neighborCell = this.getCell(neighbor.x, neighbor.y, neighbor.z);
    neighborCell.possiblePatterns = constrainedPatterns;
    if (constrainedPatterns.length === 1) {
      neighborCell.collapse(this.patterns);
    }
  }

  noValidOptionsLeft(neighbor) {
    const neighborCell = this.getCell(neighbor.x, neighbor.y, neighbor.z);
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
      if(counter > 50) {
        return true;
      }
      const position = queue.dequeue();

      for (let directionOffset in DIRECTION_OFFSETS) {
        const offsetX = DIRECTION_OFFSETS[directionOffset].x;
        const offsetZ = DIRECTION_OFFSETS[directionOffset].z;

        const neighborX = position.x + offsetX;
        const neighborZ = position.z + offsetZ;

        if (
          neighborX < 0 ||
          neighborZ < 0 ||
          neighborZ >= grid.length ||
          neighborX >= grid.length
        ) {
          continue;
        }
        let neighborPosition = { x: neighborX, y: 0, z: neighborZ, name: directionOffset };

        const constrainedPatterns = this.calculateConstrainedPatterns(position, neighborPosition);
        if (constrainedPatterns.length === 0) {
          console.log("Contradiction found, impossible constraint");
          return false;
        }
        if (this.hasChangesInPossiblePatterns(neighborPosition, constrainedPatterns)) {
          this.updatePossiblePatterns(neighborPosition, constrainedPatterns);

          const cellNeighbor = this.getCell(neighborPosition.x, 0, neighborPosition.z);

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

  getDirectionNameFromOffsets(offsetX, offsetZ) {
    const absMaxOffset = Math.max(Math.abs(offsetX), Math.abs(offsetZ));

    const normalizedOffsetX = offsetX / absMaxOffset;
    const normalizedOffsetZ = offsetZ / absMaxOffset;

    if (normalizedOffsetZ === -1) {
      return "north";
    } else if (normalizedOffsetZ === 1) {
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
   * @param {{x:number, y:number,z:number}} position
   * @returns
   */
  findUncollapsedNeighbors(position) {
    let neighbors = getNeighbors(this, position);
    return neighbors.filter(
      (neighbor) => !this.getCell(neighbor.x, neighbor.y, neighbor.z).isCollapsed
    );
  }
}
