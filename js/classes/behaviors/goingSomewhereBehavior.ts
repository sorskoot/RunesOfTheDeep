import { BehaviorBase } from "../behaviorBase.js";
import { TurnBasedEntity } from "../turnbased.js";

class GoingSomewhere implements BehaviorBase {
    private destination: { x: number; y: number };
  
    constructor(destination: { x: number; y: number }) {
      this.destination = destination;
    }
  
    execute(entity: TurnBasedEntity): void {
      // Implement moving logic based on the entity's properties (e.g., position, move points, etc.)
  
      // Since we need access to a move method that is specific to the entity (e.g., Rat),
      // it might be useful to make sure the entity has such a method before calling it.
      if ('move' in entity) {
        for (let i = 0; i < entity.movePoints; i++) {
          // Note that 'entity.move()' will call the move method of respective subclasses like Rat
          // If necessary, pass additional parameters, like target location or speed modifiers
          //entity.move(this.destination);
        }
      } else {
        console.error(`The given entity does not support moving.`);
      }
    }
  }