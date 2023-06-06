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
  name: string;

  /**
   * reference to the 3D object
   * @type {Object3D}
   */
  object: Object3D;

  /**
   * Index in the tileset
   * @type {number}
   */
  index: number;

  constructor(name: string, object: Object3D | undefined, index: number) {

    if(!object){
      throw new Error("object is undefined");
    }

    if(!name || name.length == 0){
      throw new Error("name should not be empty");
    }

    this.name = name;
    this.object = object;
    this.index = index;
  }

}
