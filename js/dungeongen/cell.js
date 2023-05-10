import rng from "@sorskoot/wonderland-components/src/utils/rng";
import { rngWithWeight } from "../forFramework/rngWithWeight";

export class Cell {
 
  isCollapsed = false;

  /**
   * The possible tiles. This array contains the index of the tile in the tileset that 
   * are still possible. The last remaining option will determain the tile that is rendered.
   * @type {numbers[]}
   */
  possiblePatterns;

  constructor(value) {
    if (value instanceof Array) {
      this.possiblePatterns = value;
    } else {
      this.possiblePatterns = [];
      for (let i = 0; i < value; i++) {
        this.possiblePatterns[i] = i;
      }
    }
  }
  
  /**
   * Collapse the cell to a single tile
   */
  collapse(allPatterns ){
    if(this.possiblePatterns.length === 0){
        throw new Error("Cannot collapse a cell with no possible tiles.");
    }

    if(this.isCollapsed){
        return; // already collapsed
    }

    // get weights from all patterns that are in the possible patterns    
    const posibleWeights = allPatterns.filter((p,i)=>
      this.possiblePatterns.includes(i)).map(p=>p.weight);
    //allPatterns.map(p=>p.weight);

    // collapse to a random option, this works even if there is only one option
    //this.possiblePatterns = [this.possiblePatterns[rng.getUniformInt(0, this.possiblePatterns.length - 1)]];
    this.possiblePatterns = [rngWithWeight(this.possiblePatterns, posibleWeights)]
      
    //console.log("Collapsed cell to: " + this.possiblePatterns[0]);
    // mark as collapsed
    this.isCollapsed = true;
  }

  /**
   * Calculate the entropy of the cell. Currently this is the length of the possible tiles array.
   * But it might change in the future when weigth is added to the possible tiles.
   * @returns {number} The entropy of the cell
   */
  calculateEntropy(allPatterns){
    if(this.isCollapsed){
        return 0;
    }else{
      const posibleWeights = allPatterns.filter((p,i)=>this.possiblePatterns.includes(i)).map(p=>p.weight);

      let totalWeight = posibleWeights.reduce((total, itemWithWeight) => {
        return total + itemWithWeight;
      }, 0);

        return totalWeight;
    }
  }
}
