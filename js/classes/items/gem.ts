import { GenericItem } from "../../dungeongen/objects/GenericItem.js";

export class Gem extends GenericItem{

    constructor(){
        super();
        super.name = "Gem";
        super.type = "item";
    }

}