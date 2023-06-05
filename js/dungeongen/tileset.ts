import { Object3D } from "@wonderlandengine/api";
import { Tile } from "./tile.js";

/**
 * The set of tiles used by the game.
 */
export class TileSet {
  
  /**
   * The set of tiles.
   * @type {Set<Tile>}
   */
  #tiles: Set<Tile>;

  /**
   * Initializes a new instance of the TileSet class.
   * @param {Object3D[]} tileObjects The list of Wonderland objects that represent the tiles.
   */
  constructor(tileObjects: Object3D[]) {
    this.#tiles = new Set();
    this.#tiles.add(new Tile("Air", this.#findObject(tileObjects, "Air"), this.#tiles.size));
    this.#tiles.add(
      new Tile("Floor01", this.#findObject(tileObjects, "Floor01"), this.#tiles.size)
    );
    this.#tiles.add(
      new Tile("Floor02", this.#findObject(tileObjects, "Floor02"), this.#tiles.size)
    );
    this.#tiles.add(
      new Tile("Floor03", this.#findObject(tileObjects, "Floor03"), this.#tiles.size)
    );
    this.#tiles.add(
      new Tile("Floor04", this.#findObject(tileObjects, "Floor04"), this.#tiles.size)
    );
    this.#tiles.add(
      new Tile("Floor05", this.#findObject(tileObjects, "Floor05"), this.#tiles.size)
    );
    this.#tiles.add(new Tile("Wall01", this.#findObject(tileObjects, "Wall01"), this.#tiles.size));
    this.#tiles.add(new Tile("Wall02", this.#findObject(tileObjects, "Wall02"), this.#tiles.size));
    this.#tiles.add(new Tile("Door", this.#findObject(tileObjects, "Door"), this.#tiles.size));
    this.#tiles.add(
      new Tile("Ceiling01", this.#findObject(tileObjects, "Ceiling01"), this.#tiles.size)
    );

    this.#tiles.add(
      new Tile("Firepit", this.#findObject(tileObjects, "Firepit"), this.#tiles.size)
    );

    this.#tiles.add(
      new Tile("Gems", this.#findObject(tileObjects, "Gems"), this.#tiles.size)
    );
  }

  /**
   * Gets the tile at the given index.
   * @param {number} index The index of the tile to get.
   * @returns {Tile} The tile at the given index.
   */
  getTile(index: number): Tile {
    return [...this.#tiles][index];
  }

  /**
   * Get a tile by its name.
   * @param {string} name
   * @returns {Tile|undefined} The tile with the given name.
   */
  getTileByName(name: string): Tile | undefined {
    return [...this.#tiles].find((x) => x.name == name);
  }

  /**
   * Finds an object in the given list of objects with the given name.
   * @param {Object3D[]} objects list of objects to seach through
   * @param {string} name name of the object to find
   * @returns {Object3D|undefined} the object with the given name
   */
  #findObject(objects: Object3D[], name: string): Object3D | undefined {
    return objects.find((x) => x.name === name);
  }
}
