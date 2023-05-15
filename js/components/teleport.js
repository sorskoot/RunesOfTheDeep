import { Component, Type } from "@wonderlandengine/api";

import { vec3 } from "gl-matrix";
import GameGlobals from "../globals";

export class SorskootTeleport extends Component {
  static TypeName = "sorskoot-teleport";
  static Properties = {
    /** Root of the player, the object that will be positioned on teleportation. */
    camRoot: { type: Type.Object },
    /** Non-vr camera for use outside of VR */
    cam: { type: Type.Object },
    /** Left eye for use in VR*/
    eyeLeft: { type: Type.Object },
    /** Right eye for use in VR*/
    eyeRight: { type: Type.Object },
  };

  init() {
    this._tempVec = new Float32Array(3);
    this._tempVec0 = new Float32Array(3);

    GameGlobals.gameState.playerPositionSubject.subscribe((pos) => {
      this._teleportPlayer(pos);
    });
    GameGlobals.gameState.playerRotationSubject.subscribe((rotation) => {
      this._rotatePlayer(rotation);
    });
  }

  _teleportPlayer(newPosition) {
    const p = this._tempVec;
    const p1 = this._tempVec0;

    if (GameGlobals.gameState.isInVR) {
      this.eyeLeft.getTranslationWorld(p);
      this.eyeRight.getTranslationWorld(p1);

      vec3.add(p, p, p1);
      vec3.scale(p, p, 0.5);
    } else {
      this.cam.getTranslationWorld(p);
    }

    this.camRoot.getTranslationWorld(p1);
    vec3.sub(p, p1, p);
    p[0] += newPosition[0];
    p[1] = newPosition[1];
    p[2] += newPosition[2];
    this.camRoot.setTranslationWorld(p);
  }

  _rotatePlayer(rotationToAdd) {
    this.camRoot.resetRotation();
    this.camRoot.rotateAxisAngleDeg([0, 1, 0], rotationToAdd);

    // const p = this._tempVec;
    // const p1 = this._tempVec0;

    // if(StorageSpace13.gameState.isInVR) {
    //     this.eyeLeft.getTranslationWorld(p);
    //     this.eyeRight.getTranslationWorld(p1);

    //     vec3.add(p, p, p1);
    //     vec3.scale(p, p, 0.5);
    // } else {
    //     this.cam.getTranslationWorld(p);
    // }

    // this.camRoot.getTranslationWorld(p1);
    // vec3.sub(p, p1, p);
    // p[0] += newPosition[0];
    // p[1] = newPosition[1];
    // p[2] += newPosition[2];
    // this.camRoot.setTranslationWorld(p);
  }
}
