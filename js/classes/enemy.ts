import { TurnBasedEntity } from "./turnbased.js";

export class Enemy extends TurnBasedEntity {
  
    constructor(movePoints: number, attackPoints: number) {
      super(movePoints, attackPoints);
    }
   
    takeTurn(): void {
      // Implement enemy-specific behavior for each turn here
      // ...
   
      // Reset the remaining turn duration after taking a turn
      this.remainingTurnDuration = 5; // Replace with the desired turn duration value
    }
   }