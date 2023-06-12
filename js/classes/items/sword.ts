import { Item } from "../../dungeongen/objects/item.js";
import { GenericItem } from "./GenaricItem.js";

export class Sword extends GenericItem{

    constructor(){
        super();
        super.name = "Sword";
        super.type = "weapon";
    }

    override attack(): number{
        return 5;
    }

    override damage(): number{
        return super.damage();
    }

}