import { Object3D } from "@wonderlandengine/api";
import { LootTableBase } from "../loot/lootTableBase.js";
import { GenericItem } from "./GenericItem.js";
import { Item } from "./item.js";
import { container, injectable } from "tsyringe";

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

    constructor(chestType: string, chestValue: string, maxItems: number, lootTable:LootTableBase){
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

