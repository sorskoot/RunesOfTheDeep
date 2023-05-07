import { Object3D } from "@wonderlandengine/api";
import { Grid } from "./grid";
import { Tile } from "./tile";
import { TileSet } from "./tileset";
import { TileAdjacencyMatrix } from "./TileAdjacencyMatrix";

/**
 * Generates a level using the Wave Function Collapse algorithm
 * @class Generator
 */
export class Generator {
  #sizeX;
  #sizeY;
  #sizeZ;

  /**
   * The entire tileset to use for the level.
   * @type {TileSet}
   */
  #tileSet;

  /**
   * The grid of cells that make up the level.
   * @type {Grid}
   */
  #grid;

  constructor(sizeX, sizeY, sizeZ) {
    this.#sizeX = sizeX;
    this.#sizeY = sizeY;
    this.#sizeZ = sizeZ;
  }

  /**
   * Creates a new TileSet from the given tile objects.
   * @param {Object3D[]} tileObjects The 3D objects to use as tiles.
   */
  createTileset(tileObjects) {
    this.#tileSet = new TileSet();

    this.#tileSet.addTile(
      new Tile("Floor01", this.#findObject(tileObjects, "Floor01"),
      this.#tileSet.length,
        new TileAdjacencyMatrix(
            [0,1],
            [0,1],
            [0,2],
            [0,2],
            [],
            []
            )),
    );

    this.#tileSet.addTile(
      new Tile("Floor02", this.#findObject(tileObjects, "Floor02"),
      this.#tileSet.length,
      new TileAdjacencyMatrix(
          [1,0],
          [1,0],
          [1,2],
          [1,2],
          [],
          []
          )),
    );

    this.#tileSet.addTile(
        new Tile("Floor04", this.#findObject(tileObjects, "Floor04"),
        this.#tileSet.length,
        new TileAdjacencyMatrix(
            [2],
            [2],
            [0,1],
            [0,1],
            [],
            []
            )),
      );
  }

  /**
   * Finds an object in the given list of objects with the given name.
   * @param {Object3D[]} objects list of objects to seach through
   * @param {string} name name of the object to find
   */
  #findObject(objects, name) {
    return objects.find((x) => x.name === name);
  }

  generate() {
    if (!this.#tileSet) {
      throw new Error("Tileset must be created before generating a level.");
    }

    this.#grid = new Grid(this.#sizeX, this.#sizeY, this.#sizeZ, this.#tileSet);
    
    let complete = false;
    do {
      complete = this.#grid.collapse();
    } while (!complete); // TODO: add a limit to the number of iterations

    return this.#grid;
  }
}
