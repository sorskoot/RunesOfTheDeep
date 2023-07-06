import { Object3D } from "@wonderlandengine/api";
import { container } from "tsyringe";
import { InternalUIManager } from "../../../ui/classes/InternalUIManager.js";
import { UiInventory } from "../../../ui/components/ui-inventory.js";

export const showInventory = {
  name: "Show Inventory",

  initialize: function () {
    // this.name = `Show Inventory`;
  },

  interact: function (ret: any, obj: Object3D, x: number, y: number, z: number) {
    const internalUIManager = container.resolve(InternalUIManager);

    const uiObject = internalUIManager.open("Inventory", [x, y, z]);
    const uiInventory = uiObject.getComponent(UiInventory);
    if (!uiInventory) {
      throw new Error("No UiInventory component found on Inventory UI object");
    }
    uiInventory.setInventory(`${this.chestType} ${this.chestValue} Chest`);
  },
};
