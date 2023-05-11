export class TileAdjacencyMatrix {
  /**
   * 
   * @param {number[]} north 
   * @param {number[]} east 
   * @param {number[]} south 
   * @param {number[]} west 
   * @param {number[]} up 
   * @param {number[]} down 
   */
    constructor(north,east,south,west, up, down) {
    this.north = north;
    this.east = east;
    this.south = south;
    this.west = west;
    this.up = up;
    this.down = down;
  }

  /**
   * indices of tiles that are allowed to be adjacent to this tile to the positive Y
   * @type {number[]}
   */
  up = []; // positive Y

  /**
   * indices of tiles that are allowed to be adjacent to this tile to the negative Y
   * @type {number[]}
   */
  down = []; // negative Y

  /**
   * indices of tiles that are allowed to be adjacent to this tile to the positive Z
   * @type {number[]}
   */
  north = []; // positive Z

  /**
   * indices of tiles that are allowed to be adjacent to this tile to the negative Z
   * @type {number[]}
   */
  south = []; // negative Z

  /**
   * indices of tiles that are allowed to be adjacent to this tile to the positive X
   * @type {number[]}
   */
  east = []; // positive X

  /**
   * indices of tiles that are allowed to be adjacent to this tile to the negative X
   * @type {number[]}
   */
  west = []; // negative X
}
