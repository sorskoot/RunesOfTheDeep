import { Tile } from "./tile";

export class TileSet {
  /**
   * type {Tile[]}
   */

  #tiles;

  constructor(tileObjects, tiledescriptionObjecy) {
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
  }

  /**
   * Adds a tile to the tileset.
   * @param {Tile} tile the tile to add to the tileset.
   */
  addTile(tile) {
    if (!(tile instanceof Tile)) {
      throw new Error("Tile must be of type Tile.");
    }

    this.#tiles.push(tile);
  }

  /**
   * Returns the superposition, i.e., all tiles in the tileset.
   * @returns {number[]} The superposition.
   */
  getSuperposition() {
    // returns a list of all indices in the tileset
    return this.#tiles.map((_, index) => index);
  }

  /**
   * Gets the tile at the given index.
   * @param {number} index The index of the tile to get.
   * @returns {Tile} The tile at the given index.
   */
  getTile(index) {
    return [...this.#tiles][index];
  }

  /**
   * Get a tile by its name.
   * @param {string} name
   * @returns {Tile} The tile with the given name.
   */
  getTileByName(name) {
    return [...this.#tiles].find((x) => x.name == name);
  }

  /**
   * Finds an object in the given list of objects with the given name.
   * @param {Object3D[]} objects list of objects to seach through
   * @param {string} name name of the object to find
   */
  #findObject(objects, name) {
    return objects.find((x) => x.name === name);
  }
}
