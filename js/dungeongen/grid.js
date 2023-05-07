import rng from "@sorskoot/wonderland-components/src/utils/rng";
import { Cell } from "./cell";
import { TileSet } from "./tileset";
import { Tile } from "./tile";
import { Queue } from "../forFramework/queue.js";
import { getNeighbors } from "./utils/gridHelpers";

export class Grid {
  sizeX;
  sizeY;
  sizeZ;

  /**
   * The entire tileset to use for the level.
   * @type {TileSet}
   */
  #tileSet;

  /**
   * The grid of cells that make up the level.
   * @type {Cell[][][]}
   */
  #grid = [[[]]];

  constructor(sizeX, sizeY, sizeZ, tileSet) {
    this.#sizeX = sizeX;
    this.#sizeY = sizeY;
    this.#sizeZ = sizeZ;
    this.#tileSet = tileSet;

    this.#createGrid();
  }

  #createGrid() {
    this.#grid = new Array(this.#sizeX);

    for (let x = 0; x < this.#sizeX; x++) {
      this.#grid[x] = new Array(this.#sizeY);

      for (let y = 0; y < this.#sizeY; y++) {
        this.#grid[x][y] = new Array(this.#sizeZ);

        for (let z = 0; z < this.#sizeZ; z++) {
          // Initialize the cell at [x][y][z] with default value, e.g., null or an object.
          this.#grid[x][y][z] = new Cell(this.#tileSet.getSuperposition());
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
   * Gets the tile at the given index from the tileset.
   * @param {number} index The index of the tile to get.
   * @returns {Tile} The tile at the given index.
   */
  getTile(index) {
    return this.#tileSet.getTile(index);
  }

  collapse() {
    let entropyCells = this.#getLowestEntropyCells();
    if (!entropyCells.length) {
      return true; // all cells are collapsed
    }

    let picked = rng.getItem(entropyCells);

    const cell = this.#grid[picked.x][picked.y][picked.z];
    cell.collapse();
    const chosenTile = cell.options[0];

    const tile = this.getTile(chosenTile);

    // const pickedNorth = tile.tileAdjacencyMatrix.north;
    // const northOptions = this.#grid[picked.x][picked.y][picked.z + 1];
    // if (northOptions) {
    //   this.checkValid(northOptions.options, pickedNorth);
    // }

    // const pickedSouth = tile.tileAdjacencyMatrix.south;
    // const southOptions = this.#grid[picked.x][picked.y][picked.z - 1];
    // if (southOptions) {
    //   this.checkValid(southOptions.options, pickedSouth);
    // }

    // const pickedEast = tile.tileAdjacencyMatrix.east;
    // const eastX = this.#grid[picked.x + 1];
    // if (eastX) {
    //   const eastOptions = eastX[picked.y][picked.z];
    //   this.checkValid(eastOptions.options, pickedEast);
    // }

    // const pickedWest = tile.tileAdjacencyMatrix.west;
    // const westX = this.#grid[picked.x - 1];
    // if (westX) {
    //   const westOptions = westX[picked.y][picked.z];
    //   this.checkValid(westOptions.options, pickedWest);
    // }

    /* 
    a. Select the cell with the lowest entropy (least number of remaining possibilities). 
        i. If there are no cells left to explore (all cells have only one possibility),
           break out of the loop and finish. 
        ii. If there's a tie, choose any of those cells randomly. 
    b. Collapse the chosen cell by randomly selecting one possibility according to their weights 
        (e.g., frequency in input). 
    c. Propagate this choice to its neighbors, reducing their possibilities based on defined 
        constraints. 
        i. If any neighbor becomes contradictory (i.e., has no valid options left), 
            backtrack to a previous state and retry.
    */
    for (let x = 0; x < this.#grid.length; x++) {
      for (let y = 0; y < this.#grid[x].length; y++) {
        for (let z = 0; z < this.#grid[x][y].length; z++) {
          const cell = this.#grid[x][y][z];
          if (cell.calculateEntropy() === 1) {
            cell.collapse();
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
          const entropy = cell.calculateEntropy();
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

  checkValid(arr, valid) {
    for (let i = arr.length - 1; i >= 0; i--) {
      let element = arr[i];
      if (!valid.includes(element)) {
        arr.splice(i, 1);
      }
    }
  }

  propagate(grid, currentPosition) {
    const queue = new Queue();
    queue.enqueue(currentPosition);

    while (!queue.isEmpty()) {
      const position = queue.dequeue();
      const neighbors = this.findUncollapsedNeighbors(position);

      neighbors.forEach((neighbor) => {
        const constrainedTiles = calculateConstrainedTiles(
          grid,
          position,
          neighbor
        );

        if (hasChangesInPossibleTiles(neighbor, constrainedTiles)) {
          updatePossibleTiles(neighbor, constrainedTiles);

          if (noValidOptionsLeft(neighbor)) {
            // Handle contradiction according to your approach (backtrack, restart)
          } else {
            queue.enqueue(neighbor);
          }
        }
      });
    }
  }

    findUncollapsedNeighbors(position) {
        getNeighbors(this,position);
        // loop through the cells and check if they are collapsed
        // if they are collapsed, remove them from the list
    }
 
}
