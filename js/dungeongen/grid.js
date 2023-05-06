import { Cell } from "./cell";

export class Grid{
    
    #sizeX;
    #sizeY;
    #sizeZ;
    #tileSet;
    
    constructor(sizeX, sizeY, sizeZ, tileSet){
        this.#sizeX = sizeX;
        this.#sizeY = sizeY;
        this.#sizeZ = sizeZ;
        this.#tileSet = tileSet;
        
        this.#createGrid();
    }

    #createGrid() {
        const grid = new Array(this.#sizeX);
      
        for (let x = 0; x < this.#sizeX; x++) {
          grid[x] = new Array(this.#sizeY);
          
          for (let y = 0; y < this.#sizeY; y++) {
            grid[x][y] = new Array(this.#sizeZ);
            
            for (let z = 0; z < this.#sizeZ; z++) {
              // Initialize the cell at [x][y][z] with default value, e.g., null or an object.
            //  grid[x][y][z] = this.#tileSet.getSuperposition();
            }
          }
        }
      
        return grid;
      }
}