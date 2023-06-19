import { Object3D } from "@wonderlandengine/api";
import { Position2D } from "../../types/position.js";
import { LootTable } from "../loot/lootTableBase.js";
import { chestDefinition } from "../roomTemplates.js";
import { GenericItem } from "./GenericItem.js";
import { Item } from "./item.js";
import { singleton, container, inject, injectable } from "tsyringe";

/*
* a container is an object that can hold items
*/
export interface container{
    maxItems: number;
    items: Array<Item>|null;
    hasBeenOpened: boolean;
}

export interface chest extends container{ 
    chestType: string; // small, medium, large
    chestValue: string; // common, rare, epic, legendary
    hasBeenOpened: boolean;
}

export class Chest extends GenericItem implements chest{
    chestType: string;
    chestValue: string;
    maxItems: number;
    items: Array<Item>|null;
    hasBeenOpened: boolean;

    constructor(chestType: string, chestValue: string, maxItems: number, lootTable:LootTable){
        super();
        this.chestType = chestType;
        this.chestValue = chestValue;
        this.maxItems = maxItems;
        this.lootTable = lootTable;
        this.hasBeenOpened = false;
    }

    override interact(obj: Object3D, x: number, y: number, z: number) {
         if(!this.hasBeenOpened || this.items == null){
            this.hasBeenOpened = true;
            this.initializeChest();
        }
        this.items = this.lootTable.getItems("entry");
        // do something to visualize the items in the chest;
        //return this.items!;
    }

    private initializeChest(){

    }
}


export interface chestCreator{
    createChest(position:Position2D, chestDefinition:chestDefinition):GenericItem;
}

@injectable()
export class ChestCreator implements chestCreator{
    lootTable: LootTable;

    constructor(@inject("LootTable") lootTable: LootTable){
        this.lootTable = lootTable;
    }

    createChest(position:Position2D, chestDefinition:chestDefinition):GenericItem
    {
        const chestItem =  new Chest("small", "common", 3, this.lootTable);
        chestItem.position = position;
        chestItem.name = "Chest";

        return chestItem;
    }
}