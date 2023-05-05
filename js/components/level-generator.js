import { Component, Type } from "@wonderlandengine/api";
import { cloneObject, ObjectCache } from "@sorskoot/wonderland-components";
import { LevelData } from "../data/level-data";
import GameGlobals from "../globals";

export class LevelGenerator extends Component {
  static TypeName = "level-generator";
  static Properties = {
    levelRoot: { type: Type.Object },
  };

  /**
   * Generates a level
   * @param {Number} level The level to generate
   * @returns {cameraPosition, targetsToComplete, cameraRotation}
   */
  generate(level = 0, parent = null) {
    this.currentLd = LevelData[level];

    if (parent) {
      this.blockCache = new ObjectCache(
        this.engine,
        "blocks" + parent.name,
        1100,
        parent,
        5000
      );
    } else {
      if (!this.levelParent) {
        this.levelParent = this.engine.scene.addObject(this.levelRoot);
        this.levelParent.name = "levelParent";
      }
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
    }

    let cameraPosition, cameraRotation;
    let targetsToComplete = 0;
    for (let layer = 0; layer < this.currentLd.layer.length; layer++) {
      for (let row = 0; row < this.currentLd.layer[layer].data.length; row++) {
        for (
          let col = 0;
          col < this.currentLd.layer[layer].data[row].length;
          col++
        ) {
          let tile = this.currentLd.layer[layer].data[row][col];

          if (layer == 0 && tile != "T") {
            this.createFloor(
              row - this.currentLd.width / 2,
              0,
              col - this.currentLd.height / 2
            );
          }

          if (layer == this.currentLd.layer.length - 1) {
            this.createCeiling(
              row - this.currentLd.width / 2,
              layer + 1,
              col - this.currentLd.height / 2
            );
          }

          if (tile == 0) {
            continue;
          }
          switch (tile) {
            case "S":
              cameraPosition = [
                row - this.currentLd.width / 2,
                0,
                col - this.currentLd.height / 2,
              ];
              break;
            case "B":
              this.createBox(
                row - this.currentLd.width / 2,
                col - this.currentLd.height / 2,
                layer
              );
              break;
            case "T":
              this.createTarget(
                row - this.currentLd.width / 2,
                col - this.currentLd.height / 2,
                layer
              );
              targetsToComplete++;
              break;

            default:
              this.createCube(
                row - this.currentLd.width / 2,
                layer,
                col - this.currentLd.height / 2,
                tile
              );
              break;
          }
        }
      }
    }
    console.log(`blocks in cache: ${this.blockCache.index}`);
    cameraRotation = this.currentLd.cam;
    return { cameraPosition, targetsToComplete, cameraRotation };
  }

  createCube(x, y, z, tile) {
    let t = "0000" + tile;
    let blockObj = this.object.children.find(
      (x) => x.name === `Block${t.substr(t.length - 2, 2)}`
    );
    let obj = cloneObject(blockObj, this.blockCache);
    obj.resetPositionRotation();
    obj.setPositionLocal([x, y, z]);
  }

  createCeiling(x, y, z) {
    this.createTile(x, y, z, `Ceiling01`);
  }

  createFloor(x, y, z) {
    this.createTile(x, y, z, `Floor01`);
  }

  createTarget(x, z, layer) {
    this.createTile(x, layer, z, `Floor_Target`);
  }

  createBox(x, z, layer) {
    let blockObj = this.object.children.find((x) => x.name === "Block06");
    let box = cloneObject(blockObj, this.blockCache);
    box.resetPositionRotation();
    box.setPositionLocal([x, layer, z]);
    let boxController = box.getComponent("box-controller");
    boxController.setState(StorageSpace13.levelState.getNewBoxState());
  }

  createTile(x, y, z, tile) {
    let blockObj = this.object.children.find((x) => x.name === tile);
    let obj = cloneObject(blockObj, this.blockCache);
    obj.resetPositionRotation();
    obj.setPositionLocal([x, y, z]);
  }
}
