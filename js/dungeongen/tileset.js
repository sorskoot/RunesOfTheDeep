import { Tile } from "./tile";

export class TileSet {
  /**
   * @type {Tile[]}
   */
  #tiles = [];

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
    if (index >= this.#tiles.length || index < 0) {
      throw new Error(`Tile index ${index} is out of bounds.`);
    }

    return this.#tiles[index];
  }
}
