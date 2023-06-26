import "reflect-metadata";
import { container } from "tsyringe";

import { Component, Object3D, Property } from "@wonderlandengine/api";

import { vec3 } from "gl-matrix";
import { property } from "@wonderlandengine/api/decorators.js";
import { GameState } from "../classes/gameState.js";

export class SorskootTeleport extends Component {
  static TypeName = "sorskoot-teleport";
  static Properties = {
    /** Root of the player, the object that will be positioned on teleportation. */
    camRoot: Property.object(),
    /** Non-vr camera for use outside of VR */
    cam: Property.object(),
    /** Left eye for use in VR*/
    eyeLeft: Property.object(),
    /** Right eye for use in VR*/
    eyeRight: Property.object(),
  };

  /**
   * Left eye for use in VR
   * @type {Object3D}
   */
  @property.object()
  eyeLeft!: Object3D;
  /**
   * Right eye for use in VR
   * @type {Object3D}
   */
  @property.object()
  eyeRight!: Object3D;
  /**
   * Non-vr camera for use outside of VR
   * @type {Object3D}
   */
  @property.object()
  cam!: Object3D;
  /**
   * Root of the player, the object that will be positioned on teleportation
   * @type {Object3D}
   */
  @property.object()
  camRoot!: Object3D;
  
  private _tempVec: Float32Array= new Float32Array(3);
  private _tempVec0: Float32Array= new Float32Array(3);
  gameState: GameState;

  init() {
    this.gameState = container.resolve(GameState);
    this.gameState.playerPositionSubject.subscribe((pos) => {
      this.#teleportPlayer(pos);
    });
    this.gameState.playerRotationSubject.subscribe((rotation) => {
      this.#rotatePlayer(rotation);
    });
  }

  #teleportPlayer(newPosition: number[]) {
    const p = this._tempVec;
    const p1 = this._tempVec0;

    if (this.gameState.isInVR) {
      this.eyeLeft.getPositionWorld(p);
      this.eyeRight.getPositionWorld(p1);

      vec3.add(p, p, p1);
      vec3.scale(p, p, 0.5);
    } else {
      this.cam.getPositionWorld(p);
    }

    this.camRoot.getPositionWorld(p1);
    vec3.sub(p, p1, p);
    p[0] += newPosition[0];
    p[1] = newPosition[1];
    p[2] += newPosition[2];
    this.camRoot.setPositionWorld(p);
  }

  #rotatePlayer(rotationToAdd: number) {
    this.camRoot.resetRotation();
    this.camRoot.rotateAxisAngleDegObject([0, 1, 0], rotationToAdd);
  }
}
