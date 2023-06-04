import { Component, Object3D, Property } from "@wonderlandengine/api";
import GameGlobals from "../globals";
import { LevelGenerator } from "./level-generator";
import { State } from "../classes/gameState";

export class Game extends Component {
  static TypeName = "game";
  static Properties = {
    levelGenObject: Property.object(),
    playerObject: Property.object(),
  };

  /**
   * @type {Object3D}
   */
  levelGenObject;
  /**
   * @type {LevelGenerator}
   */
  #levelGen;

  init() {
    // document.getElementById("afterLoading").style.display = "block";
    this.#levelGen = this.levelGenObject.getComponent(LevelGenerator);

    this.engine.onXRSessionStart.add(() => (GameGlobals.gameState.isInVR = true));
    this.engine.onXRSessionEnd.add(() => (GameGlobals.gameState.isInVR = false));

    this.engine.onXRSessionStart.add(() => {});

    GameGlobals.gameState.state = State.Playing;
  }

  start() {
    GameGlobals.gameState.levelSubject.subscribe((level) => {
      //GameGlobals.levelState.initLevelState(level);

      let result = this.#levelGen.generate(level);

      //  GameGlobals.gameState.playerRotation = result.cameraRotation;
  //    GameGlobals.gameState.playerPosition = result.cameraPosition;

      GameGlobals.gameState.navigateToRoom(0, 0);

      // GameGlobals.gameState.availableTargets = result.targetsToComplete;
      // GameGlobals.levelState.availableTargets = result.targetsToComplete;
    });

    setTimeout(() => {
      GameGlobals.gameState.level = 0;
    }, 1000); // just delay the start. This will change once we have a menu.

    window.addEventListener("keyup", (e) => {
      let p = GameGlobals.gameState.currentRoom;
      if (e.code == "Digit1") { // SOUTH
        p[0] += 1;
        GameGlobals.gameState.roomPreviousExitDirection = "S";
        GameGlobals.gameState.currentRoom = p;
      }
      if (e.code == "Digit2") { // NORTH
        p[0] -= 1;
        GameGlobals.gameState.roomPreviousExitDirection = "N";
        GameGlobals.gameState.currentRoom = p;
      }
      if (e.code == "Digit3") { // EAST
        p[1] += 1;
        GameGlobals.gameState.roomPreviousExitDirection = "E";
        GameGlobals.gameState.currentRoom = p;
      }
      if (e.code == "Digit4") { // WEST
        p[1] -= 1;
        GameGlobals.gameState.roomPreviousExitDirection = "W";
        GameGlobals.gameState.currentRoom = p;
      }
    });
  }
}
