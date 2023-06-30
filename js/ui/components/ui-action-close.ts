import { Component, Object3D } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";
import { UiButton } from "./ui-button.js";
import { UiManager } from "./ui-manager.js";

/**
 * ui-button
 */
export class UiActionClose extends Component {
  static TypeName = "ui-action-close";

  @property.object()
  uiButtonObject: Object3D;

  @property.object()
  uiRootObject: Object3D;

  @property.object()
  uiManagerObject: Object3D;

  private uiButton: UiButton;
  private uiManager: UiManager;

  start(): void {
    const but = this.uiButtonObject.getComponent(UiButton);
    if (!but) {
      throw new Error("No button component found on button mesh object");
    }
    this.uiButton = but;

    const uiman = this.uiManagerObject.getComponent(UiManager);
    if (!uiman) {
        throw new Error("No ui manager component found on ui manager object");
    }
    this.uiManager = uiman;

    if(!this.uiRootObject) {
        throw new Error("No ui root object set");
    }

    this.uiButton.pressed.add(() => {
        this.uiManager.closeAll();
    });
  }
}
