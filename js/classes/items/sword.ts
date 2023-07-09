import { Texture, WonderlandEngine } from "@wonderlandengine/api";
import { GenericItem } from "../../dungeongen/objects/GenericItem.js";
import { container } from "tsyringe";

export class Sword extends GenericItem {
  baseMinDamage: number = 1;
  baseMaxDamage: number = 3;
  criticalHitChance: number = 0.05; // 5%
  criticalDamageMultiplier: number = 2.0;

  constructor() {
    const engine = container.resolve(WonderlandEngine);
    const cs = new Image();
    cs.src = `/Weapons/Iron/iron-weapons_00.png`;
    const t = new Texture(engine, cs);
    super(t);
    super.name = "Sword";
    super.type = "weapon";
  }

  isCriticalHit(): boolean {
    return Math.random() <= this.criticalHitChance / 100;
  }

  calculateRawBaseDamage(): number {
    return (
      Math.floor(Math.random() * (this.baseMaxDamage - this.baseMinDamage + 1)) + this.baseMinDamage
    );
  }

  override attack(): number {
    const rawBaseDmg = this.calculateRawBaseDamage();
    if (this.isCriticalHit()) {
      return rawBaseDmg * this.criticalDamageMultiplier;
    } else {
      return rawBaseDmg;
    }
  }
}
