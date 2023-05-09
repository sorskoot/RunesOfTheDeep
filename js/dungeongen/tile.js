import { Object3D } from "@wonderlandengine/api";
import { TileAdjacencyMatrix } from "./TileAdjacencyMatrix";

/**
 * A tile is a visual representation of a number at a specific location in the grid.
 * The cells in the main 3D Grid of the game are made from patters, each pattern is NxN tiles
 */
export class Tile {

  /**
   * The adjacency matrix for this tile
   * @type {TileAdjacencyMatrix}   
   */
  #tileAdjacencyMatrix;

  /**
   * name of the 3d object
   * @type {string}
   */
  name;

  /**
   * reference to the 3D object
   * @type {Object3D}
   */
  object;

  /**
   * Index in the tileset
   * @type {number}
   */
  index;

  /**
   * 
   * @param {string} name 
   * @param {Object3D} object 
   * @param {number} index 
   * @param {TileAdjacencyMatrix} tileAdjacency 
   */
  constructor(name, object, index, tileAdjacency) {
    this.name = name;
    this.object = object;
    this.index = index;
    this.#tileAdjacencyMatrix = tileAdjacency;
  }

  getAdjacentTiles(direction) {
    return this.#tileAdjacencyMatrix[direction];
  }
}
