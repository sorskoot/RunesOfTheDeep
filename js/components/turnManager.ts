import {Component, Property} from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';

/**
 * turnManager
 */
export class TurnManager extends Component {
    static TypeName = 'turnManager';
    
    @property.float(5.0)
    turnDuration: number = 5.0; // Each turn lasts for 5 seconds
    
    @property.int(5)
    stepsPerTurn: number = 5; // Number of steps per turn

    private timeSinceLastStep: number = 0;
    private stepsTaken: number = 0;
    private isTurnInProgress: boolean = false;
    private turnCounter: number = 0;

    override update(dt: number) {
        if (!this.isTurnInProgress) {
            this.isTurnInProgress = true;
            this.stepsTaken = 0;
            this.timeSinceLastStep = 0;
            this.turnCounter++;
            this.newTurn();
        }

        if (this.isTurnInProgress) {
            this.timeSinceLastStep += dt;

            const stepInterval = this.turnDuration / this.stepsPerTurn;

            while (this.timeSinceLastStep >= stepInterval && this.stepsTaken < this.stepsPerTurn) {
                this.stepFunction();
                this.stepsTaken++;
                this.timeSinceLastStep -= stepInterval;
            }

            if (this.stepsTaken == this.stepsPerTurn) {
                // End of current turn
                this.isTurnInProgress = false;
                this.endTurn();
            }
        }
    }

    stepFunction() {
     
    }

    newTurn(){
     
    }

    endTurn(){
     
    }
}
