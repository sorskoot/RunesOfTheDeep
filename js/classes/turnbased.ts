import { BehaviorBase } from "./behaviorBase.js";

export abstract class TurnBasedEntity {
    public movePoints: number;
    protected attackPoints: number;
    protected remainingTurnDuration: number;
    protected behaviors: Map<string, BehaviorBase>;

    constructor(movePoints: number, attackPoints: number) {
      this.movePoints = movePoints;
      this.attackPoints = attackPoints;
      this.remainingTurnDuration = 0;
      this.behaviors = new Map();
    }

    addBehavior(name: string, behaviorInstance: BehaviorBase): void {
      this.behaviors.set(name, behaviorInstance);
    }
    
    executeBehavior(name: string): void {
      const behavior = this.behaviors.get(name);
      
      if (!behavior) {
        console.error(`No behavior with name "${name}" was found.`);
        return;
      }
    
      behavior.execute(this);
    }
    


    abstract takeTurn(): void;
  
    updateTurn(elapsedTime: number): void {
      if (this.remainingTurnDuration > 0) {
        this.remainingTurnDuration -= elapsedTime;
        if (this.remainingTurnDuration <= 0) {
          this.takeTurn();
        }
      }
    }
  
    applyStatus(status: StatusEffect): void {
      // Implementation for applying status effects like fire or poison goes here
      // ...
    }
  
  }
  
  interface StatusEffect {
    effectType: string;
    duration?: number;
  }