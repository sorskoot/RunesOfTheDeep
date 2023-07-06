import { Object3D } from "@wonderlandengine/api";
import { LootTableBase } from "../loot/lootTableBase.js";
import { GenericItem } from "./GenericItem.js";
import { Item } from "./item.js";
import { container, injectable } from "tsyringe";
import { MaterialValue, Size } from "../../types/simpleTypes.js";

/*
* a container is an object that can hold items
*/
export interface container{
    maxItems: number;
    items: Array<Item>|null;
    hasBeenOpened: boolean;
}

export interface chest extends container{ 
    chestType: Size; // small, medium, large
    chestValue: MaterialValue; // wood, iron, gold
    hasBeenOpened: boolean;
}

export class Chest extends GenericItem implements chest{
    chestType: Size;
    chestValue: MaterialValue;
    maxItems: number;
    items: Array<Item>|null;
    hasBeenOpened: boolean;

    constructor(chestType: Size, chestValue: MaterialValue, maxItems: number, lootTable:LootTableBase){
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
        console.log(this.items);
        // do something to visualize the items in the chest;
        //return this.items!;
    }

    private initializeChest(){

    }
}

