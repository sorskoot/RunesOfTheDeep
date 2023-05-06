import { Object3D } from "@wonderlandengine/api";

export class Tile{
    
    #up = [];   // positive Y
    #down = []; // negative Y
    #north = [];// positive Z 
    #south = [];// negative Z
    #east = []; // positive X
    #west = []; // negative X

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

    constructor(name, object, index){
        this.name = name;
        this.object = object;
        this.index = index;
    }

}