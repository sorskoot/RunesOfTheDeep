import { Item } from "./item.js";
import { BehaviorBase } from "./behaviorBase.js";
import { Position2D } from "../../types/position.js";
import { Object3D, Texture } from "@wonderlandengine/api";

type Rarity = "common" | "rare" | "epic" | "legendary";
type ItemType = "weapon" | "container" | "item" | "shield";

export abstract class GenericItem extends BehaviorBase implements Item {
  id: number;
  name: string;
  active: boolean;
  type: ItemType;
  description: string;
  rarity: Rarity;
  position: Position2D = { x: 0, y: 0 };
  texture: Texture;

  constructor(texture:Texture|null = null, rarity: Rarity = "common", position: Position2D = { x: 0, y: 0 }) {
    super();
    this.id = +new Date();
    if(texture){
      this.texture = texture;
    }
    this.active = false;
    this.type = "item";
    this.name = "Nameless Item";
    this.description = "it is nothing special";
    this.rarity = rarity;
    this.position = position;
  }

  damage(hit: number): number {
    return hit;
  }

  protection(): number {
    return 0;
  }

  range(): number {
    return 0;
  }

  interact(obj: Object3D, x: number, y: number, z: number) {}

  attack() {}

  turn() {}

  equip() {}

  unequip() {}

  refresh() {}

  over(): boolean {
    return true;
  }

  createUI?() {
    return 0;
  }
}
