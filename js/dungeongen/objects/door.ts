import { DirectionSymbol, Position2D } from "../../types/index.js";
import { GenericItem } from "./GenericItem.js";

export class Door extends GenericItem{
    
    direction:DirectionSymbol;
    targetRoom:Position2D;

    constructor(direction:DirectionSymbol, targetRoom:Position2D){
        super();
        super.name = "Sword";
        super.type = "door";
        this.direction = direction;
        this.targetRoom = targetRoom;
    }

    override interact() {
        console.log("interacting with door")
    }
}