import { GenericItem } from "../../dungeongen/objects/GenericItem.js";

export class Shield extends GenericItem{

    constructor(){
        super();
        super.name = "Shield";
        super.type = "shield";
    }
}