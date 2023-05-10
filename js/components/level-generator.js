import { Component, Type } from "@wonderlandengine/api";
import { cloneObject, ObjectCache } from "@sorskoot/wonderland-components";
import { LevelData } from "../data/level-data";
import GameGlobals from "../globals";
import { Generator } from "../dungeongen/generator";
import {
  buildConstraintsMap,
  extractPatternsWrap ,
} from "../dungeongen/utils/extractor";

const size = 5;
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
    this.generator = new Generator(size, 1, size);
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
    // const inputImage = [
    //   ["7", "6", "6", "6", "6", "6", "6", "6","6"],
    //   ["6", "3", "3", "6", "6", "3", "3", "3","3"],
    //   ["6", "3", "1", "3", "3", "2", "1", "1","3"],
    //   ["6", "3", "1", "1", "1", "1", "1", "1","3"],
    //   ["6", "3", "1", "1", "5", "1", "1", "1","3"],
    //   ["6", "3", "1", "1", "1", "1", "1", "1","3"],
    //   ["6", "3", "1", "1", "1", "1", "1", "1","3"],
    //   ["6", "3", "1", "1", "1", "1", "1", "1","3"],
    //   ["6", "3", "3", "3", "3", "3", "3", "3","3"]];
//const inputImage = [
//       ["1", "1", "1"],
//       ["1", "5", "1"],
//       ["1", "1", "1"],
//     ];
    // Usage example:
    const inputImage = [
      ["1", "1", "1","1"],
      ["1", "6", "6","6"],
      ["1", "6", "2","6"],
      ["1", "6", "6","6"],
    ];

    // const inputImage = [
    //   ["6", "6", "1", "6", "6", "6", "6", "6"],
    //   ["6", "1", "1", "1", "6", "1", "1", "6"],
    //   ["1", "1", "1", "1", "1", "1", "1", "6"],
    //   ["6", "1", "1", "1", "6", "1", "1", "6"],
    //   ["6", "6", "1", "6", "6", "6", "6", "6"],
    //   ["6", "6", "1", "6", "6", "1", "1", "6"],
    //   ["6", "6", "1", "6", "6", "1", "1", "6"],
    //   ["6", "6", "1", "1", "1", "1", "1", "6"],
    //   ["6", "6", "6", "6", "6", "1", "1", "6"],
    //   ["6", "6", "6", "6", "6", "6", "6", "6"],
    // ];

    const extractedPatterns = extractPatternsWrap(inputImage, patternSize);
    
    //console.log(extractedPatterns);
    let constraintMappingForAllKeySets = buildConstraintsMap(extractedPatterns, patternSize);
    console.log(constraintMappingForAllKeySets);

    this.generator.createTileset(this.object.children);

    const grid = this.generator.generate(extractedPatterns, constraintMappingForAllKeySets);

    console.log(grid);
    this.levelParent.children.length = 0;
    if (!GameGlobals.globalObjectCache) {
      GameGlobals.globalObjectCache = new ObjectCache(
        this.engine,
        "blocks",
        1200,
        this.levelParent,
        8000
      );
    } else {
      GameGlobals.globalObjectCache.reset();
    }
    this.blockCache = GameGlobals.globalObjectCache;

    this.render(grid);

    return;

    // let cameraPosition, cameraRotation;
    // let targetsToComplete = 0;
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
    // cameraRotation = this.currentLd.cam;
    // return { cameraPosition, targetsToComplete, cameraRotation };
  }

  render(grid) {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        //this.createTile(row - size / 2, 0, col - size / 2, "Floor01");
        const cell = grid.getCell(row, 0, col);
        if (cell && cell.isCollapsed && cell.possiblePatterns.length === 1) {
          const currentTile = grid.getPattern(cell.possiblePatterns[0]);
          let ps = patternSize - 1;
          // Loop through the rows of the 3x3 grid

          for (let gridRow = 0; gridRow < ps; gridRow++) {
            // Loop through the columns of the 3x3 grid
            for (let gridColumn = 0; gridColumn < ps; gridColumn++) {
              if (currentTile) {
                // Calculate the row and col positions for each tile in the 3x3 grid,
                // adjusting their positions based on their indices within the grid.
                const newRowPos = row * ps + gridRow - (size * ps) / 2;
                const newColPos = col * ps + gridColumn - (size * ps) / 2;
                const tileIndex = grid.getPattern(cell.possiblePatterns[0]).pattern[gridRow][
                  gridColumn
                ];
                const tile = this.generator.getTile(tileIndex);

                this.createTile(newRowPos, 0, newColPos, tile.object);
              }
            }
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
