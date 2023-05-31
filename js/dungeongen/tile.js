import { Object3D } from "@wonderlandengine/api";
/**
 * A tile is a visual representation of a number at a specific location in the grid.
 * The cells in the main 3D Grid of the game are made from patters, each pattern is NxN tiles
 */
export class Tile {

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
   * @param {Object3D|undefined} object 
   * @param {number} index 
   */
  constructor(name, object, index) {

    if(!object){
      throw new Error("object is undefined");
    }

    this.name = name;
    this.object = object;
    this.index = index;
  }

}
