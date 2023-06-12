import { TurnBasedEntity } from "./turnbased.js";

/**
 * This class is the base of all behaviors. 
 * The idea is that all behaviors have a common base class,
 * so that they can be stored in a list and iterated over.
 * Every object, enemy, weapon, etc. can have a list of behaviors.
 */
export abstract class BehaviorBase {
    constructor() {
        
    }

    abstract execute(entity: TurnBasedEntity): void;
    
}