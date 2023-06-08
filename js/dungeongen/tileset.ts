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

  #enemyObjects: Object3D[];
  #characterObjects: Object3D[];
  
  /**
   * Initializes a new instance of the TileSet class.
   * @param {Object3D[]} tileObjects The list of Wonderland objects that represent the tiles.
   */
  constructor(tileObjects: Object3D[], enemyObjects: Object3D[], characterObjects: Object3D[]) {
    
    this.#enemyObjects = enemyObjects;
    this.#characterObjects = characterObjects;
    
    this.#tiles = new Set();

    for(let i = 0; i < tileObjects.length; i++) {
      this.#tiles.add(
        new Tile(tileObjects[i].name, tileObjects[i], this.#tiles.size)
      );  
    }
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

  getCharacter(characterName: string) {
    return this.#characterObjects.find((x) => x.name === characterName); 
  }

  resetAllCharacters() {
    for(let i = 0; i < this.#characterObjects.length; i++) {
      this.#characterObjects[i].resetPositionRotation();
    }
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
