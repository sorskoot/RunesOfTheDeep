import { GenericItem } from "../../dungeongen/objects/GenericItem.js";

export class Shield extends GenericItem {
  baseBlockChance: number = 0.1;
  damageReduction: number = 1;

  constructor() {
    super();
    super.name = "Shield";
    super.type = "shield";
  }

  isBlocked(): boolean {
    return Math.random() <= this.baseBlockChance / 100;
  }

  applyDamageReduction(damage: number): number {
    return Math.max(0, damage - this.damageReduction);
  }

  damage(hit:number): number {
    return this.applyDamageReduction(hit);
  }
}
