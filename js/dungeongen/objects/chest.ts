import { Item } from "./item.js";

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