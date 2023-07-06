import "reflect-metadata";
import { Component, Object3D, Property } from "@wonderlandengine/api";
import { LevelGenerator } from "./level-generator.js";
import { GameState, State } from "../classes/gameState.js";
import { property } from "@wonderlandengine/api/decorators.js";
import { Sword } from "../classes/items/sword.js";
import iron from "../classes/behaviors/iron.js";
import { container } from "tsyringe";

export class Game extends Component {
  static TypeName = "game";
  static Properties = {
    levelGenObject: Property.object(),
    playerObject: Property.object(),
  };

  @property.object()
  levelGenObject!: Object3D;

  @property.object()
  playerObject!: Object3D;

  #levelGen!: LevelGenerator;
  gameState: GameState;

  init() {
    this.gameState = container.resolve(GameState);
    
    const lg = this.levelGenObject.getComponent(LevelGenerator)
    if(!lg){
      throw new Error("LevelGenerator not found on levelGenObject")
    }
    this.#levelGen = lg;

    this.engine.onXRSessionStart.add(() => (this.gameState.isInVR = true));
    this.engine.onXRSessionEnd.add(() => (this.gameState.isInVR = false));

    this.engine.onXRSessionStart.add(() => {});

    this.gameState.state = State.Playing;
  }

  start() {
    this.gameState.levelSubject.subscribe((level) => {
      let result = this.#levelGen.generate(level);
      this.gameState.navigateToRoom(0, 0);
 
    }
    );
    const testSword = new Sword();
    testSword.addBehavior(iron);
    console.log(`${testSword.name}:${testSword.attack()}`);

    setTimeout(() => {
      this.gameState.level = 0;
    }, 1000); // just delay the start. This will change once we have a menu.

    window.addEventListener("keyup", (e) => {
      let p = this.gameState.currentRoom;
      if (e.code == "Digit1") { // SOUTH
        p[0] += 1;
        this.gameState.roomPreviousExitDirection = "S";
        this.gameState.currentRoom = p;
      }
      if (e.code == "Digit2") { // NORTH
        p[0] -= 1;
        this.gameState.roomPreviousExitDirection = "N";
        this.gameState.currentRoom = p;
      }
      if (e.code == "Digit3") { // EAST
        p[1] += 1;
        this.gameState.roomPreviousExitDirection = "E";
        this.gameState.currentRoom = p;
      }
      if (e.code == "Digit4") { // WEST
        p[1] -= 1;
        this.gameState.roomPreviousExitDirection = "W";
        this.gameState.currentRoom = p;
      }

      if (e.code == "Digit5") { // open first chest
        this.gameState.room?.items?.find((i) => i.name == "Chest")?.interact(this.playerObject,8,0,8);
      };
    });
  }

  override update(delta: number): void {
    
  }
}
