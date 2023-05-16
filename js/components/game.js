import { Component, Type } from "@wonderlandengine/api";
import GameGlobals from "../globals";
import { LevelGenerator } from "./level-generator";
import { FadeScreen } from "./fadeScreen";

export class Game extends Component {
  static TypeName = "game";
  static Properties = {
    levelGenObject: { type: Type.Object },
    playerObject: { type: Type.Object },
  };

  /**
   * @type {LevelGenerator}
   */
  #levelGen;

  init() {
    // document.getElementById("afterLoading").style.display = "block";

    this.#levelGen = this.levelGenObject.getComponent("level-generator");

    this.engine.onXRSessionStart.add(() => (GameGlobals.gameState.isInVR = true));
    this.engine.onXRSessionEnd.add(() => (GameGlobals.gameState.isInVR = false));

    this.engine.onXRSessionStart.add(() => {});
  }

  start() {
    GameGlobals.gameState.levelSubject.subscribe((level) => {
      //GameGlobals.levelState.initLevelState(level);

      let result = this.#levelGen.generate(level);

      //  GameGlobals.gameState.playerRotation = result.cameraRotation;
      GameGlobals.gameState.playerPosition = result.cameraPosition;

      GameGlobals.gameState.navigateToRoom(0, 0, "none");

      // GameGlobals.gameState.availableTargets = result.targetsToComplete;
      // GameGlobals.levelState.availableTargets = result.targetsToComplete;
    });

    setTimeout(() => {
      GameGlobals.gameState.level = 0;
    },1000); // just delay the start. This will change once we have a menu.
  }
}
