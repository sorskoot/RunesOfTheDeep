import rng from "@sorskoot/wonderland-components/src/utils/rng";

export class Cell {
  /**
   * Is the cell collapsed of not
   * @param {boolean}
   */
  get isCollapsed(){
    return this.#isCollapsed;
  } 
  
  #isCollapsed = false;

  /**
   * The options. This array contains the index of the tile in the tileset that 
   * are still possible. The last remaining option will determain the tile that is rendered.
   * @type {numbers[]}
   */
  options;

  constructor(value) {
    if (value instanceof Array) {
      this.options = value;
    } else {
      this.options = [];
      for (let i = 0; i < value; i++) {
        this.options[i] = i;
      }
    }
  }
  
  /**
   * Collapse the cell to a single option
   */
  collapse(){
    if(this.options.length === 0){
        throw new Error("Cannot collapse a cell with no options.");
    }

    if(this.#isCollapsed){
        return; // already collapsed
    }

    // collapse to a random option, this works even if there is only one option
    this.options = [this.options[rng.getUniformInt(0, this.options.length - 1)]];
    
    // mark as collapsed
    this.#isCollapsed = true;
  }

  /**
   * Calculate the entropy of the cell. Currently this is the length of the options array.
   * But it might change in the future when weigth is added to the options.
   * @returns {number} The entropy of the cell
   */
  calculateEntropy(){
    if(this.#isCollapsed){
        return 0;
    }else{
        return this.options.length;
    }
  }
}
