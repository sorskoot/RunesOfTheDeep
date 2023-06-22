import globals from "../../globals.js";
import { Enemy } from "./enemy.js";

class Rat extends Enemy {
    private position: { x: number; y: number };
  
    constructor() {
      super(2, 1); // Rat has 2 move points and 1 attack point
      this.position = { x: 0, y: 0 }; // Initial position of the rat; set according to your game world coordinates
      this.remainingTurnDuration = 5; // Turn duration is set to 5 seconds
    }
  
    takeTurn(): void {
      // Implement rat-specific behavior for each turn here
      
      // Move action (Rat will spend its move points)
      for (let i = 0; i < this.movePoints; i++) {
        this.move();
      }
      
      // Attack action (Rat will use its attack point) 
      if (this.isPlayerInRange()) {
        this.attack();
      }
  
      // Reset the remaining turn duration after taking a turn
      this.remainingTurnDuration = 5;
   }
  
   move(destination?: { x:number, y:number }):void{
    if(!destination){return;}
   
     // Implement moving logic for the rat here
     // Example: randomly change position by one unit in any direction
     
     const dx = Math.random() > 0.5 ? -1 : +1;
     const dy = Math.random() > 0.5 ? -1 : +1;
     
     this.position.x += dx;
     this.position.y += dy;
   }
  
   private isPlayerInRange(): boolean {
     // Implement logic to check if player is within attack range of the rat
     // Return true if player is in range, false otherwise
     
     const playerPosition = { x: globals.gameState.playerPosition[0], y: globals.gameState.playerPosition[2]}; 
     
     const distanceToPlayer = Math.sqrt(
       Math.pow(this.position.x - playerPosition.x,2) +
       Math.pow(this.position.y - playerPosition.y,2)
     );
  
     return distanceToPlayer <= 3;
   }
  
   private attack(): void {
     // Implement attacking logic here when a player is within range
   }
  }
