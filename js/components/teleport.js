import { Component, Object3D, Property } from "@wonderlandengine/api";

import { vec3 } from "gl-matrix";
import GameGlobals from "../globals";

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
  eyeLeft;
   /**
   * Right eye for use in VR
   * @type {Object3D}
   */
  eyeRight;
   /**
   * Non-vr camera for use outside of VR
   * @type {Object3D}
   */
  cam;
  /**
   * Root of the player, the object that will be positioned on teleportation
   * @type {Object3D}
   */
  camRoot;

  init() {
    this._tempVec = new Float32Array(3);
    this._tempVec0 = new Float32Array(3);

    GameGlobals.gameState.playerPositionSubject.subscribe((pos) => {
      this.#teleportPlayer(pos);
    });
    GameGlobals.gameState.playerRotationSubject.subscribe((rotation) => {
      this.#rotatePlayer(rotation);
    });
  }

  #teleportPlayer(newPosition) {
    const p = this._tempVec;
    const p1 = this._tempVec0;

    if (GameGlobals.gameState.isInVR) {
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

  #rotatePlayer(rotationToAdd) {
    this.camRoot.resetRotation();
    this.camRoot.rotateAxisAngleDegLocal([0, 1, 0], rotationToAdd);
  }
}
