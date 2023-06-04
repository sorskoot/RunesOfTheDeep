import { Component, Object3D, Property } from "@wonderlandengine/api";

import { vec3} from "gl-matrix";
import GameGlobals from "../globals";
import { State } from "../classes/gameState";
import { Sounds } from "../utils/soundfx-player";
import { Tags } from "@sorskoot/wonderland-components";

export class PickTarget extends Component {
  static TypeName = "pick-target";
  static Properties = {
    allowedPickerMeshObject: Property.object(),
    notAllowedPickerMeshObject: Property.object(),
    floorGroup: Property.int(1),
    player: Property.object(),
    navControllerObject: Property.object(),
  };
  
  /**
   * @type {Object3D}
   */ 
  allowedPickerMeshObject;

  /**
   * @type {Object3D}
   */
  notAllowedPickerMeshObject;

  /**
   * @type {number}
   */
  floorGroup;

  /**
   * @type {Object3D}
   */
  player;

  /**
   * @type {Object3D}
   */
  navControllerObject;

  /**
   * Whether the picking is active or not
   * @returns {boolean}
   */
  #canTrigger() {
    return true;
  }

  /**
   * Validates whether the object can be picked or not
   * @param {Object3D} obj 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} z 
   * @returns {boolean} Boolean indicating whether the object can be picked or not
   */
  #pickingAllowed(obj, x, y, z) {
    let tags = obj.getComponent(Tags);
    if (!tags) {
      return false;
    }
    if (GameGlobals.gameState.state !== State.Playing) {
      if (tags.hasTag("button")) {
        return true;
      }
      return false;
    }

    if (tags.hasTag("floor")) {
      return GameGlobals.gameState.canTeleportToPosition(x, y, z);
    }
    return true;
  }

  /**
   * Handles the picking of an object
   * @param {Object3D} obj The object that is picked
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} z 
   */
  #picked(obj, x, y, z) {
    let tags = obj.getComponent(Tags);
    if (!tags) return;
    let position = GameGlobals.gameState.playerPosition;
    //this.player.getTranslationWorld(position);
    switch (true) {
      case tags.hasTag("floor"):
        GameGlobals.soundFxPlayer.playSound(Sounds.teleport);
        GameGlobals.gameState.playerPosition = [x, position[1], z];
        break;
      case tags.hasTag("button"):
        break;
      case tags.hasTag("door"):
        console.log("picking door not implemented yet");
        break;
    }
  }

  start() {
    this.pickingActive = false;

    this.input = this.object.getComponent("input");
    if(!this.input) {
      console.error("No input component found on object with pick-target component");
    }

    this.#hideIndicators();
    this.initialized = true;
  }

  update(dt) {
    let xrInputSource = this.input.xrInputSource;
    if (!this.initialized || !xrInputSource) {
      return;
    }
    const buttonPressed = xrInputSource.gamepad.buttons[0].pressed;
    if (buttonPressed && this.pickingActive === false && this.#canTrigger()) {
      this.pickingActive = true;
    }

    if (!buttonPressed && this.pickingActive === true) {
      this.pickingActive = false;
      if (this.hitSpot) {
        const hitPos = this.hitObject.getPositionWorld();
        const x = hitPos[0];
        const y = hitPos[2];
        if (this.#pickingAllowed(this.hitObject, x, 0, y)) {
          this.#picked(this.hitObject, x, 0, y);
        }

        if (!this.indicatorHidden) {
          this.#hideIndicators();
          
        }
        this.hitSpot = undefined;
      }
    }

    if (this.pickingActive) {
      const objectPosition = this.object.getPositionWorld(); 
      const objectRotation = this.object.getRotationWorld(); 

      let origin = vec3.clone(objectPosition);

      let defaultForward = vec3.fromValues(0, 0, -1);
      let forwardDirection = vec3.create();
      vec3.transformQuat(forwardDirection, defaultForward, objectRotation);

      let rayHit = this.engine.scene.rayCast(
        origin,
        forwardDirection,
        1 << this.floorGroup
      );
      
      if (rayHit.hitCount > 0) {
        if (this.indicatorHidden) {
          this.indicatorHidden = false;
        }
        this.hitSpot = rayHit.locations[0];
        this.hitObject = rayHit.objects[0];
        const hitPos = this.hitObject.getPositionWorld();
        const x = hitPos[0];
        const y = hitPos[2];
        this.#showIndicator(this.hitObject, x, 0, y);
      } else {
        if (!this.indicatorHidden) {
          this.#hideIndicators();
        }
        this.hitSpot = undefined;
        this.hitObject = undefined;
      }
    }
  }

  /**
   * Hides the indicators
   */
  #hideIndicators() {
    this.allowedPickerMeshObject.setPositionWorld([1000, -1000, 1000]);
    this.notAllowedPickerMeshObject.setPositionWorld([1000, -1000, 1000]);
    this.indicatorHidden = true;
  }

  /**
   * Shows the indicator for the object
   * @param {Object3D} obj the targeted object
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} z 
   */
  #showIndicator(obj, x, y, z) {
    let tags = obj.getComponent(Tags);
    if (!tags) return;
    switch (true) {
      case tags.hasTag("floor"):
        if (this.#pickingAllowed(obj, x, y, z)) {
          this.notAllowedPickerMeshObject.setPositionWorld([
            1000, -1000, 1000,
          ]);
          this.allowedPickerMeshObject.resetPositionRotation();
          this.allowedPickerMeshObject.setPositionWorld([x, 0.01, z]);
        } else {
          this.allowedPickerMeshObject.setPositionWorld([1000, -1000, 1000]);
          this.notAllowedPickerMeshObject.resetPositionRotation();
          this.notAllowedPickerMeshObject.setPositionWorld([x, 0.01, z]);
        }
        break;
      case tags.hasTag("button"):
        //   let buttonController = obj.getComponent('button-controller');
        //   if(buttonController){
        //     buttonController.hover();
        //   }
        break;
      case tags.hasTag("door"):
        break;
    }
  }
}
