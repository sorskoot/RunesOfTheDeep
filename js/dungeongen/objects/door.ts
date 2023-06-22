import { Object3D } from "@wonderlandengine/api";
import globals from "../../globals.js";
import { DirectionSymbol, Position2D } from "../../types/index.js";
import { GenericItem } from "./GenericItem.js";
import { GameState } from "../../classes/gameState.js";
import { container } from "tsyringe";

export class Door extends GenericItem{
    
    direction:DirectionSymbol;
    targetRoom:Position2D;

    constructor(
        direction:DirectionSymbol, 
        targetRoom:Position2D,
        currentPosition:Position2D){
        super();
        super.name = "Door";
        super.type = "item";
        this.direction = direction;
        this.targetRoom = targetRoom;
        this.position = currentPosition;
    }

    override interact(obj:Object3D, x:number, y:number, z:number){
        const gameState = container.resolve(GameState);
        gameState.navigateToRoom(this.targetRoom.x, this.targetRoom.y, this.direction);
    }

}