import { Component, Property, Object3D } from "@wonderlandengine/api";
import { ObjectCache, cloneObject } from "@sorskoot/wonderland-components";

import { LevelData } from "../data/level-data.js";
import GameGlobals from "../globals.js";
import { MazeGenerator } from "../dungeongen/MazeGenerator.js";
import { TileSet } from "../dungeongen/tileset.js";
import { PatternSet } from "../dungeongen/PatternSet.js";
import { Room } from "../dungeongen/room.js";
import { RoomRenderer } from "../dungeongen/RoomRenderer.js";
import { FadeScreen } from "./fadeScreen.js";
import { getInvertedDirection } from "../dungeongen/utils/gridHelpers.js";
import { property } from "@wonderlandengine/api/decorators.js";

const size = 9;
const patternSize = 3;

export class LevelGenerator extends Component {
  static TypeName = "level-generator";
  static Properties = {
    levelRoot: Property.object(),
    fadeScreenObject: Property.object(),
    lights: Property.object(), // Lights are the children of this object.
  };

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
  lights!: Object3D;

  /**
   * The component that is used to fade the screen to black and back.
   */
  fadeScreenComponent!: FadeScreen;

  generator!: MazeGenerator;
  
  levelParent!: Object3D;
  
  currentLd!: {
    width: number;
    height: number;
    depth: number;
    data: ({ data: string; door: null } | { data: string; door: number } | null)[][][];
    start: { X: number; Y: number; Z: number; Rx: number; Ry: number; Rz: number };
  };
  tileset!: TileSet;
  patternSet!: PatternSet;
  roomRenderer!: RoomRenderer;
  blockCache!: ObjectCache;
  /**
   * overrides the init method of the component
   */
  init() {
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
    this.currentLd = LevelData[level];
    this.levelParent = parent || this.levelRoot;

    this.tileset = new TileSet(this.object.children);
    this.patternSet = new PatternSet();

    this.generator.generate();

    this.levelParent.children.length = 0;
    if (!GameGlobals.globalObjectCache) {
      GameGlobals.globalObjectCache = new ObjectCache(
        this.engine,
        "blocks",
        2400,
        this.levelParent,
        24000
      );
    } else {
      GameGlobals.globalObjectCache.reset();
    }

    this.roomRenderer = new RoomRenderer(
      this.engine,
      this.levelParent,
      this.tileset,
      this.lights.children,
      GameGlobals.globalObjectCache
    );
    this.blockCache = GameGlobals.globalObjectCache;

    GameGlobals.gameState.currentRoomSubject.subscribe((r) => {
      const currentRoom = this.generator.getRoom(r[0], r[1]);
      this.fadeScreenComponent.FadeOutCompleted.once(() => {
        this.blockCache.reset();
        this.roomRenderer.render(currentRoom);
        if (GameGlobals.gameState.roomPreviousExitDirection) {
          let enterDirection = getInvertedDirection(
            GameGlobals.gameState.roomPreviousExitDirection
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
            GameGlobals.gameState.playerPosition = [exit.x, 0, exit.y];
            GameGlobals.gameState.playerRotation = rotation;
          }
        }
      });

      this.fadeScreenComponent.fadeOut();
    });

    this.renderDebug(this.generator);
  }

  /**
   * Creates a room in the scene that is rendered and where the player can do stuff
   * @param {Room} room The room to render
   */
  render(room: Room) {
    const roomdesign = this.currentLd;
    for (let i = 0; i < roomdesign.width; i++) {
      for (let j = 0; j < roomdesign.height; j++) {
        for (let h = 0; h < roomdesign.depth; h++) {
          const tileIndex = roomdesign.data[i][j][h];
          if (tileIndex != null && tileIndex != undefined) {
            let tile = this.tileset.getTileByName(tileIndex.data);
            if(tile){
              this.createTile(i, j, h, tile.object);
            }else{
              console.warn("Tile not found: " + tileIndex.data);
            }
          }
        }
      }
    }
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
