import { Component, Object3D, math } from "@wonderlandengine/api";

import { vec2, vec3} from "gl-matrix";
import GameGlobals from "../globals.js";
import { GameState, State } from "../classes/gameState.js";
import { Sounds } from "../utils/soundfx-player.js";
import { Tags } from "@sorskoot/wonderland-components";
import { property } from "@wonderlandengine/api/decorators.js";
import { container } from "tsyringe";

export class PickTarget extends Component {
  static TypeName = "pick-target";
  
  /**
   * @type {Object3D}
   */ 
  @property.object()
  allowedPickerMeshObject!: Object3D;

  /**
   * @type {Object3D}
   */
  @property.object()
  notAllowedPickerMeshObject!: Object3D;

  /**
   * @type {number}
   */
  @property.int(1<<2)
  floorGroup: number = 1<<2;

  /**
   * @type {Object3D}
   */
  @property.object()
  player!: Object3D;

  /**
   * @type {Object3D}
   */
  @property.object()
  navControllerObject!: Object3D;
  pickingActive: boolean = false;
  input: any;
  initialized: boolean = false;
  hitSpot: any;
  hitObject: any;
  indicatorHidden: any;
  gameState: GameState;

  init(): void {
    this.gameState = container.resolve(GameState);
  }

  /**
   * Whether the picking is active or not
   * @returns {boolean}
   */
  #canTrigger(): boolean {
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
  #pickingAllowed(obj: Object3D, x: number, y: number, z: number): boolean {
    let tags = obj.getComponent(Tags);
    if (!tags) {
      return false;
    }
    if (this.gameState.state !== State.Playing) {
      if (tags.hasTag("button")) {
        return true;
      }
      return false;
    }

    return this.gameState.canPick(x, y, z);

  }

  /**
   * Handles the picking of an object
   * @param {Object3D} obj The object that is picked
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} z 
   */
  #picked(obj: Object3D, x: number, y: number, z: number) {
    return this.gameState.pick(obj, x, y, z);
    
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
  
  forceNotAllowed = false;

  update(dt:number) {
    
    let xrInputSource = this.input.xrInputSource;
    if (!this.initialized || !xrInputSource || !xrInputSource.gamepad || 
      !xrInputSource.gamepad.buttons) {
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
        if (this.#pickingAllowed(this.hitObject, x, 0, y) && !this.forceNotAllowed) {
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
        let pos = this.player.getPositionWorld();
        let ppos = vec2.fromValues(Math.round(pos[0]), Math.round(pos[2]));
        
        if(vec2.distance(ppos, [x, y]) > 1.6) {
           this.forceNotAllowed = true;
         }else{
           this.forceNotAllowed = false;
         }

        this.#showIndicator(this.hitObject, x, 0, y, this.forceNotAllowed);
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
  #showIndicator(obj: Object3D, x: number, y: number, z: number, forceNotAllowed: boolean = false) {
    
    if(forceNotAllowed){ // it's not allow ever if we force it
      this.allowedPickerMeshObject.setPositionWorld([1000, -1000, 1000]);
      this.notAllowedPickerMeshObject.resetPositionRotation();
      this.notAllowedPickerMeshObject.setPositionWorld([x, 0.01, z]);
      return;
    }

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
