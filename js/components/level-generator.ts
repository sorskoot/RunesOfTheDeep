import "reflect-metadata";
import { container } from "tsyringe";

import { Component, Object3D } from "@wonderlandengine/api";
import { ObjectCache, cloneObject } from "@sorskoot/wonderland-components";
import { MazeGenerator } from "../dungeongen/MazeGenerator.js";
import { TileSet } from "../dungeongen/tileset.js";
import { PatternSet } from "../dungeongen/PatternSet.js";
import { RoomRenderer } from "../dungeongen/RoomRenderer.js";
import { FadeScreen } from "./fadeScreen.js";
import { property } from "@wonderlandengine/api/decorators.js";
import { getInvertedDirection } from "../dungeongen/utils/directionHelpers.js";

import { GameState } from "../classes/gameState.js";

const size = 9;
const patternSize = 3;

export class LevelGenerator extends Component {
  static TypeName = "level-generator";

  /**
   * The object used to get the fade screen component from.
   */
  @property.object()
  fadeScreenObject!: Object3D;

  /**
   * The level root object. All level objects will be added as children of this object.
   */
  @property.object()
  levelRoot!: Object3D;

  /**
   * The root object of the lights. Available Lights are children of this.
   */
  @property.object()
  lights!: Object3D;

  @property.object()
  levelBlocks!: Object3D;

  @property.object()
  enemies!: Object3D;

  @property.object()
  characters!: Object3D;

  /**
   * The component that is used to fade the screen to black and back.
   */
  fadeScreenComponent!: FadeScreen;

  generator!: MazeGenerator;
  
  levelParent!: Object3D;
  
  tileset!: TileSet;
  patternSet!: PatternSet;
  roomRenderer!: RoomRenderer;
  blockCache!: ObjectCache;
  gameState: GameState;
  globalObjectCache!: ObjectCache;
  
  /**
   * overrides the init method of the component
   */
  init() {
    this.gameState = container.resolve(GameState);
  
    this.generator = new MazeGenerator(size, size);
  }

  /**
   * overrides the start method of the component
   */
  start() {
    const fsc = this.fadeScreenObject.getComponent(FadeScreen);
    if (!fsc) {
      throw new Error("No FadeScreen component found on fadeScreenObject");
    }
    this.fadeScreenComponent = fsc;
  }

  /**
   * Generates a level
   * @param {Number} level The level to generate
   * @returns {any}
   */
  generate(level: number = 0, parent: Object3D | null = null): any {
    this.levelParent = parent || this.levelRoot;

    this.tileset = new TileSet(
      this.levelBlocks.children,
      this.enemies.children,
      this.characters.children);
    this.patternSet = new PatternSet();

    this.generator.generate();

    this.levelParent.children.length = 0;
    if (!this.globalObjectCache) {
      this.globalObjectCache =  new ObjectCache(
        this.engine,
        "blocks",
        2400,
        this.levelParent,
        24000
      );
    } else {
      this.globalObjectCache.reset();
    }

    this.roomRenderer = new RoomRenderer(
      this.engine,
      this.levelParent,
      this.tileset,
      this.lights.children,
      this.globalObjectCache
    );
    this.blockCache = this.globalObjectCache;

    this.gameState.currentRoomSubject.subscribe((r) => {
      const currentRoom = this.generator.getRoom(r[0], r[1]);
      this.fadeScreenComponent.FadeOutCompleted.once(() => {
        this.blockCache.reset();
        this.roomRenderer.render(currentRoom);
        if (this.gameState.roomPreviousExitDirection) {
          let enterDirection = getInvertedDirection(
            this.gameState.roomPreviousExitDirection
          );
          let exit = currentRoom.getDoor(enterDirection);
          if (exit) {
            let rotation = 0;
            switch (enterDirection) {
              case "N":
                exit.y += 1;
                rotation = 180;
                break;
              case "S":
                exit.y -= 1;
                rotation = 0;
                break;
              case "E":
                exit.x -= 1;
                rotation = 90;
                break;
              case "W":
                exit.x += 1;
                rotation = 270;
                break;
            }
            this.gameState.playerPosition = [exit.x, 0, exit.y];
            this.gameState.playerRotation = rotation;
          }
        }
      });

      this.fadeScreenComponent.fadeOut();
      this.gameState.setCurrentRoom(currentRoom);
    });

    this.renderDebug(this.generator);
  }

  /**
   * Renders a debug view of the map
   * @param {MazeGenerator} generator
   */
  renderDebug(generator: MazeGenerator) {
    const canvas = document.createElement("canvas");
    //    canvas.style.display = "none";
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.zIndex = "100";
    //scale canvas 300%, nearest neighbor
    canvas.style.width = "256px";
    canvas.style.imageRendering = "pixelated";

    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        //this.createTile(row - size / 2, 0, col - size / 2, "Floor01");
        const currentRoom = generator.getRoom(row, col);

        let ps = 5;

        const pattern = this.patternSet.get(currentRoom.toKey());

        for (let gridRow = 0; gridRow < ps; gridRow++) {
          // Loop through the columns of the 3x3 grid
          for (let gridColumn = 0; gridColumn < ps; gridColumn++) {
            // Calculate the row and col positions for each tile in the 3x3 grid,
            // adjusting their positions based on their indices within the grid.
            const newRowPos = row * ps + gridRow - (size * ps) / 2;
            const newColPos = col * ps + gridColumn - (size * ps) / 2;

            let tileIndex = pattern[gridRow][gridColumn];
            if (currentRoom.isEntrance) {
              tileIndex = 5;
            }
            if (currentRoom.isExit) {
              tileIndex = 4;
            }
            if (currentRoom.isTreasure && tileIndex == 6) {
              tileIndex = 7;
            }
            let tile = this.tileset.getTile(tileIndex);
            //  this.createTile(newRowPos, 0, newColPos, tile.object);

            //also draw the tile as a pixel to the canvas:
            switch (tileIndex) {
              case 5:
                ctx.fillStyle = "green";
                break;
              case 4:
                ctx.fillStyle = "red";
                break;
              case 6:
                ctx.fillStyle = "blue";
                break;
              case 7:
                ctx.fillStyle = "yellow";
                break;
              default:
                ctx.fillStyle = "gray";
                break;
            }
            if (tileIndex >= 4)
              ctx.fillRect(
                (newColPos + (size * ps) / 2) * 2,
                (newRowPos + (size * ps) / 2) * 2,
                2,
                2
              );
          }
        }
      }
    }
    document.body.appendChild(canvas);
  }

 
  createTile(x:number, y:number, z:number, tile:Object3D) {
    let blockObj = tile;
    let obj = cloneObject(this.engine, blockObj, this.blockCache);
    if(!obj){
      throw new Error("Could not clone object: " + blockObj.name);
    }
    obj.resetPositionRotation();
    obj.setPositionWorld([x, y, z]);
  }
}
