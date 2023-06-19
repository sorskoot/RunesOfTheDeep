import { Position2D } from "../../types/position.js";
import { chestDefinition } from "../roomTemplates.js";
import { GenericItem } from "./GenericItem.js";
import { Item } from "./item.js";
import { singleton } from "tsyringe";
/*
* a container is an object that can hold items
*/
export interface container{
    maxItems: number;
    items: Array<Item>;
}

export interface chest extends container{ 
    chestType: string; // small, medium, large
    chestValue: string; // common, rare, epic, legendary
}

export class Chest extends GenericItem implements chest{
    chestType: string;
    chestValue: string;
    maxItems: number;
    items: Item[];

    constructor(chestType: string, chestValue: string, maxItems: number, items: Item[]){
        super();
        this.chestType = chestType;
        this.chestValue = chestValue;
        this.maxItems = maxItems;
        this.items = items;
    }
}


export interface chestCreator{
    createChest(position:Position2D, chestDefinition:chestDefinition):GenericItem;
}

@singleton()
export class ChestCreator implements chestCreator{
    createChest(position:Position2D, chestDefinition:chestDefinition):GenericItem
    {
        
        const chestItem =  new Chest("small", "common", 3, []);
        chestItem.position = position;
        chestItem.name = "Chest";

        return chestItem;
    }
}