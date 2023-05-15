import { Component, Type } from "@wonderlandengine/api";
import { cloneObject, ObjectCache } from "@sorskoot/wonderland-components";
import { LevelData } from "../data/level-data";
import GameGlobals from "../globals";
import { MazeGenerator } from "../dungeongen/MazeGenerator";
import { TileSet } from "../dungeongen/tileset";
import { PatternSet } from "../dungeongen/PatternSet";
import { Room } from "../dungeongen/room";
import { RoomRenderer } from "../dungeongen/RoomRenderer";

const size = 9;
const patternSize = 3;

export class LevelGenerator extends Component {
  static TypeName = "level-generator";
  static Properties = {
    levelRoot: { type: Type.Object },
  };

  /**
   * overrides the init method of the component
   */
  init() {
    this.generator = new MazeGenerator(size, size);
  }

  /**
   * Generates a level
   * @param {Number} level The level to generate
   * @returns {cameraPosition, targetsToComplete, cameraRotation}
   */
  generate(level = 0, parent = null) {
    console.log("generate level", level);

    this.currentLd = LevelData[level];
    this.levelParent = parent || this.levelRoot;

    this.tileset = new TileSet(this.object.children, {});
    this.patternSet = new PatternSet();



    this.generator.generate();

    this.levelParent.children.length = 0;
    if (!GameGlobals.globalObjectCache) {
      GameGlobals.globalObjectCache = new ObjectCache(
        this.engine,
        "blocks",
        2400,
        this.levelParent,
        16000
      );
    } else {
      GameGlobals.globalObjectCache.reset();
    }

    this.roomRenderer = new RoomRenderer(this.engine, this.levelParent, this.tileset, GameGlobals.globalObjectCache);
    this.blockCache = GameGlobals.globalObjectCache;

    GameGlobals.gameState.currentRoomSubject.subscribe(r=>{
      const currentRoom = this.generator.getRoom(r[0], r[1]);
      //this.render(currentRoom);
      this.levelParent.children.length = 0;
      GameGlobals.globalObjectCache.reset();
      this.roomRenderer.render(currentRoom);
    });

    

    let cameraPosition = [this.currentLd.start.X, this.currentLd.start.Y,this.currentLd.start.Z];
    let cameraRotation = [this.currentLd.start.Rx, this.currentLd.start.Ry,this.currentLd.start.Rz];

    // for (let layer = 0; layer < this.currentLd.layer.length; layer++) {
    //   for (let row = 0; row < this.currentLd.layer[layer].data.length; row++) {
    //     for (
    //       let col = 0;
    //       col < this.currentLd.layer[layer].data[row].length;
    //       col++
    //     ) {
    //       let tile = this.currentLd.layer[layer].data[row][col];

    //       if (layer == 0 && tile != "T") {
    //         this.createFloor(
    //           row - this.currentLd.width / 2,
    //           0,
    //           col - this.currentLd.height / 2
    //         );
    //       }

    //       if (layer == this.currentLd.layer.length - 1) {
    //         this.createCeiling(
    //           row - this.currentLd.width / 2,
    //           layer + 1,
    //           col - this.currentLd.height / 2
    //         );
    //       }

    //       if (tile == 0) {
    //         continue;
    //       }
    //       switch (tile) {
    //         case "S":
    //           cameraPosition = [
    //             row - this.currentLd.width / 2,
    //             0,
    //             col - this.currentLd.height / 2,
    //           ];
    //           break;
    //         case "B":
    //           this.createBox(
    //             row - this.currentLd.width / 2,
    //             col - this.currentLd.height / 2,
    //             layer
    //           );
    //           break;
    //         case "T":
    //           this.createTarget(
    //             row - this.currentLd.width / 2,
    //             col - this.currentLd.height / 2,
    //             layer
    //           );
    //           targetsToComplete++;
    //           break;

    //         default:
    //           this.createCube(
    //             row - this.currentLd.width / 2,
    //             layer,
    //             col - this.currentLd.height / 2,
    //             tile
    //           );
    //           break;
    //       }
    //     }
    //   }
    // }
    // console.log(`blocks in cache: ${this.blockCache.index}`);
    //cameraRotation = this.currentLd.cam;
    return { cameraPosition, cameraRotation };
  }

  /**
   *
   * @param {Room} room
   */
  render(room) {
    const roomdesign = this.currentLd;
    for (let i = 0; i < roomdesign.width; i++) {
      for (let j = 0; j < roomdesign.height; j++) {
        for (let h = 0; h < roomdesign.depth; h++) {
          const tileIndex = roomdesign.data[i][j][h];
          if (tileIndex!=null && tileIndex!=undefined) {
            let tile = this.tileset.getTileByName(tileIndex.data);
            console.log(tileIndex.data);
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
            this.createTile(newRowPos, 0, newColPos, tile.object);
          }
        }
      }
    }
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
