import rng from "@sorskoot/wonderland-components/src/utils/rng";
import { Cell } from "./cell";
import { TileSet } from "./tileset";
import { Tile } from "./tile";
import { Queue } from "../forFramework/queue.js";
import { getNeighbors, getInvertedDirection } from "./utils/gridHelpers";
import { checkConstraints } from "./utils/extractor";

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

  tilePatterns;
  constraintMappingForAllKeySets;

  constructor(sizeX, sizeY, sizeZ, tileSet, extractedPatterns, constraintMappingForAllKeySets) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.sizeZ = sizeZ;
    this.#tileSet = tileSet;
    this.tilePatterns = extractedPatterns;
    this.constraintMappingForAllKeySets = constraintMappingForAllKeySets;
    this.#createGrid();
  }

  #createGrid() {
    this.#grid = new Array(this.sizeX);

    for (let x = 0; x < this.sizeX; x++) {
      this.#grid[x] = new Array(this.sizeY);

      for (let y = 0; y < this.sizeY; y++) {
        this.#grid[x][y] = new Array(this.sizeZ);

        for (let z = 0; z < this.sizeZ; z++) {
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

    if (!cell.isCollapsed && cell.possibleTiles.length === 0) {
      // we have a contradiction
      return true;
    }

    cell.collapse();
    const chosenTile = cell.possibleTiles[0];

    const tile = this.getTile(chosenTile);
    this.propagate(this.#grid, picked);

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
  isValidAdjacent(currentTile, neighborTile, directionName) {
    //  Access adjacency information using TileAdjacencyMatrix or equivalent
    const allowedNeighbors = this.#tileSet.getTile(currentTile).getAdjacentTiles(directionName);

    // const allowedFromNeighbor = this.#tileSet
    //   .getTile(neighborTile)
    //   .getAdjacentTiles(getInvertedDirection(directionName));

    // check if neighborTile is compatible based on adjacency rules
    if (allowedNeighbors.includes(neighborTile)) {
      return true;
    } else {
      return false;
    }
    // console.log(allowedNeighbors, allowedFromNeighbor);
    // debugger
    //   # Check if neighborTile is compatible based on adjacency rules
    //   if neighborTile in allowedNeighbors:
    //       return true
    //   else:
    //       return false
  }

  calculateConstrainedTiles(current, neighbor) {
    const currentCell = this.getCell(current.x, current.y, current.z);
    const currentOptions = currentCell.possibleTiles;
    // 0
    const neighborCell = this.getCell(neighbor.x, neighbor.y, neighbor.z);
    const neighborOptions = neighborCell.possibleTiles;
    // 0,1,2
    const constrainedTiles = [];

    for (let i = 0; i < currentOptions.length; i++) {
      const currentTileIndex = currentOptions[i];
      for (let j = 0; j < neighborOptions.length; j++) {
        console.log(
          this.tilePatterns[currentTileIndex],
          this.tilePatterns[neighborOptions[j]],
        );
        if(
          
          checkConstraints(
            this.tilePatterns[currentTileIndex],
            this.tilePatterns[neighborOptions[j]],
            3
          )[neighbor.name]

          // this.isValidAdjacent(
          //   currentTileIndex,
          //   neighborOptions[j],
          //   neighbor.name
          // )
        ) {
          constrainedTiles.push(neighborOptions[j]);
        }
      }
    }

    return constrainedTiles;
  }

  hasChangesInPossibleTiles(neighbor, constrainedTiles) {
    const neighborCell = this.getCell(neighbor.x, neighbor.y, neighbor.z);
    const neighborOptions = neighborCell.possibleTiles;
    const hasChanges = neighborOptions.length !== constrainedTiles.length;
    return hasChanges;
  }

  updatePossibleTiles(neighbor, constrainedTiles) {
    const neighborCell = this.getCell(neighbor.x, neighbor.y, neighbor.z);
    neighborCell.possibleTiles = constrainedTiles;
    if (constrainedTiles.length === 1) {
      neighborCell.collapse();
    }
  }

  noValidOptionsLeft(neighbor) {
    const neighborCell = this.getCell(neighbor.x, neighbor.y, neighbor.z);
    const neighborOptions = neighborCell.possibleTiles;
    return neighborOptions.length === 0;
  }
  /**
   * propagate the choice to its neighbors, reducing their possibilities based on
   * defined constraints
   * @param {Grid} grid
   * @param {{x:number, y:number, z:number}} currentPosition
   */
  // propagate(grid, currentPosition) {
  //   const queue = new Queue();
  //   queue.enqueue(currentPosition);

  //   while (!queue.isEmpty()) {
  //     const position = queue.dequeue();
  //     const neighbors = this.findUncollapsedNeighbors(position);
  //     const cell = this.getCell(position.x, position.y, position.z);
  //     //const tile = this.getTile(cell.possibleTiles[0]);

  //     neighbors.forEach((neighbor) => {
  //       const constrainedTiles = this.calculateConstrainedTiles(
  //         position,
  //         neighbor
  //       );

  //       if (this.hasChangesInPossibleTiles(neighbor, constrainedTiles)) {
  //         this.updatePossibleTiles(neighbor, constrainedTiles);
  //         if (!cell.isCollapsed) {
  //           if (this.noValidOptionsLeft(neighbor)) {
  //             // Handle contradiction according to your approach (backtrack, restart)
  //             console.log("contradiction");
  //           } else {
  //             queue.enqueue(neighbor);
  //           }
  //         }
  //       }
  //     });
  //   }
  // }

  propagate(grid, currentPosition) {
    const queue = new Queue();
    queue.enqueue(currentPosition);

    const patternSize = 3; // Set this according to your requirements

    while (!queue.isEmpty()) {
      const position = queue.dequeue();

      for (let offsetZ = -(patternSize - 1); offsetZ <= patternSize - 1; offsetZ++) {
        for (let offsetX = -(patternSize - 1); offsetX <= patternSize - 1; offsetX++) {
          if (offsetX === 0 && offsetZ === 0) {
            continue; // Skip processing the same cell.
          }

          const neighborX = position.x + offsetX;
          const neighborZ = position.z + offsetZ;

          if (
            neighborX < 0 ||
            neighborZ < 0 ||
            neighborZ >= grid.length ||
            neighborX >= grid[0].length
          ) {
            continue;
          }

          const directionName = this.getDirectionNameFromOffsets(offsetX, offsetZ);

          if (!directionName) {
            console.error(`Unknown direction: (${offsetX}, ${offsetZ})`);
            continue;
          }

          let neighborPosition = { x: neighborX, y: 0, z: neighborZ, name: directionName };

          const constrainedTiles = this.calculateConstrainedTiles(position, neighborPosition);

          if (this.hasChangesInPossibleTiles(neighborPosition, constrainedTiles)) {
            this.updatePossibleTiles(neighborPosition, constrainedTiles);

            const cellNeighbor = this.getCell(neighborPosition.x, 0, neighborPosition.z);

            if (!cellNeighbor.isCollapsed) {
              if (this.noValidOptionsLeft(neighborPosition)) {
                // Handle contradiction according to your approach (backtrack, restart)
                console.log("contradiction");
              } else {
                queue.enqueue(neighborPosition);
              }
            }
          }
        }
      }
    }
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
