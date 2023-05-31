import { Component, Type, Object3D } from "@wonderlandengine/api";
import { ObjectCache, cloneObject } from "@sorskoot/wonderland-components";

import { LevelData } from "../data/level-data";
import GameGlobals from "../globals";
import { MazeGenerator } from "../dungeongen/MazeGenerator";
import { TileSet } from "../dungeongen/tileset";
import { PatternSet } from "../dungeongen/PatternSet";
import { Room } from "../dungeongen/room";
import { RoomRenderer } from "../dungeongen/RoomRenderer";
import { FadeScreen } from "./fadeScreen";

const size = 9;
const patternSize = 3;

export class LevelGenerator extends Component {
  static TypeName = "level-generator";
  static Properties = {
    levelRoot: { type: Type.Object },
    fadeScreenObject: { type: Type.Object },
  };

  /**
   * The object used to get the fade screen component from.
   * @type {Object3D}
   */
  fadeScreenObject;

  /**
   * The level root object. All level objects will be added as children of this object.
   * @type {Object3D}
   */
  levelRoot;
  
  /**
   * The component that is used to fade the screen to black and back.
   * @type {FadeScreen}
   */
  fadeScreenComponent;

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
    this.fadeScreenComponent = this.fadeScreenObject.getComponent(FadeScreen);
  }

  /**
   * Generates a level
   * @param {Number} level The level to generate
   * @returns {any}
   */
  generate(level = 0, parent = null) {
    console.log("generate level", level);

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
      GameGlobals.globalObjectCache
    );
    this.blockCache = GameGlobals.globalObjectCache;

    GameGlobals.gameState.currentRoomSubject.subscribe((r) => {
      const currentRoom = this.generator.getRoom(r[0], r[1]);
      console.log(currentRoom.distanceFromEntrance);
      //this.render(currentRoom);
      this.fadeScreenComponent.FadeOutCompleted.once(() => {
        //this.levelParent.children.length = 0;
        GameGlobals.globalObjectCache.reset();
        this.roomRenderer.render(currentRoom);
      });
      this.fadeScreenComponent.fadeOut();
    });

    this.renderDebug(this.generator);

    let cameraPosition = [this.currentLd.start.X, this.currentLd.start.Y, this.currentLd.start.Z];
    let cameraRotation = [
      this.currentLd.start.Rx,
      this.currentLd.start.Ry,
      this.currentLd.start.Rz,
    ];

    return { cameraPosition, cameraRotation };
  }

  /**
   * Creates a room in the scene that is rendered and where the player can do stuff
   * @param {Room} room The room to render
   */
  render(room) {
    const roomdesign = this.currentLd;
    for (let i = 0; i < roomdesign.width; i++) {
      for (let j = 0; j < roomdesign.height; j++) {
        for (let h = 0; h < roomdesign.depth; h++) {
          const tileIndex = roomdesign.data[i][j][h];
          if (tileIndex != null && tileIndex != undefined) {
            let tile = this.tileset.getTileByName(tileIndex.data);
            this.createTile(i, j, h, tile.object);
          }
        }
      }
    }
  }
  /**
   * Renders a debug view of the map
   * @param {MazeGenerator} generator
   */
  renderDebug(generator) {
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
    const ctx = canvas.getContext("2d");
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
                (newRowPos + (size * ps) / 2) * 2,
                (newColPos + (size * ps) / 2) * 2,
                2,
                2
              );
          }
        }
      }
    }
    document.body.appendChild(canvas);
  }

  // createCube(x, y, z, tile) {
  //   let t = "0000" + tile;
  //   let blockObj = this.object.children.find(
  //     (x) => x.name === `Block${t.substr(t.length - 2, 2)}`
  //   );
  //   let obj = cloneObject(blockObj, this.blockCache);
  //   obj.resetPositionRotation();
  //   obj.setPositionLocal([x, y, z]);
  // }

  // createCeiling(x, y, z) {
  //   this.createTile(x, y, z, `Ceiling01`);
  // }

  // createFloor(x, y, z) {
  //   this.createTile(x, y, z, `Floor01`);
  // }

  // createTarget(x, z, layer) {
  //   this.createTile(x, layer, z, `Floor_Target`);
  // }

  // createBox(x, z, layer) {
  //   let blockObj = this.object.children.find((x) => x.name === "Block06");
  //   let box = cloneObject(blockObj, this.blockCache);
  //   box.resetPositionRotation();
  //   box.setPositionLocal([x, layer, z]);
  //   let boxController = box.getComponent("box-controller");
  //   boxController.setState(GameGlobals.levelState.getNewBoxState());
  // }

  createTile(x, y, z, tile) {
    let blockObj = tile;
    let obj = cloneObject(this.engine, blockObj, this.blockCache);
    obj.resetPositionRotation();
    obj.setPositionLocal([x, y, z]);
  }
}
