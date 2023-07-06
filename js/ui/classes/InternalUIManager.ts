import { singleton } from "tsyringe";
import { UiManager } from "../components/ui-manager.js";
import { NumberArray, Object3D } from "@wonderlandengine/api";

/**
 * This class is used as an intermediary between the UI components and the rest of the game.
 * This makes it possible to access the UI from anywhere in the game.
 */
@singleton()
export class InternalUIManager {
  
  uiManager: UiManager;

  registerComponent(uiManager: UiManager) {
    this.uiManager = uiManager;
  }

  isUiOpen(): boolean {
    if (this.uiManager) {
      return this.uiManager.isUiOpen();
    } else {
      return false;
    }
  }

  open(name: string, position: Readonly<NumberArray>): Object3D {
    if (!this.uiManager) {
        throw new Error("No ui manager registered");
    }
    
    return this.uiManager.open(name, position);
  }

  closeAll() {
    if (this.uiManager) {
        this.uiManager.closeAll();
    }
  }
}
