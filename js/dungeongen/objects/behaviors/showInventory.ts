import { Object3D } from "@wonderlandengine/api";
import { container } from "tsyringe";
import { InternalUIManager } from "../../../ui/classes/InternalUIManager.js";

export const showInventory = {
    name: "Show Inventory",

    initialize: function () {
        // this.name = `Show Inventory`;
    },

    interact:function(ret:any, obj:Object3D, x:number, y:number, z:number){
        const internalUIManager = container.resolve(InternalUIManager);
        internalUIManager.open("Inventory", [x, y, z]);
    }
  };