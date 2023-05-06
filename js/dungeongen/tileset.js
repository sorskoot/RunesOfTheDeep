import { Cell } from "./cell";
import { Tile } from "./tile";

export class TileSet{

    /**
     * @type {Tile[]}
     */
    #tiles = [];

    constructor(){
    
    }

    getSuperposition(){
        return new Cell();
    }
}