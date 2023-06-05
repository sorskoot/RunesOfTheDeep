import { rotatePattern } from "./utils/extractor";

export class PatternSet {
  #patterns = new Map();

  constructor() {
    this.#patterns.set("N", [
      [6, 6, 1, 6, 6],
      [6, 1, 1, 1, 6],
      [6, 1, 1, 1, 6],
      [6, 1, 1, 1, 6],
      [6, 6, 6, 6, 6],
    ]);
    this.#patterns.set("E", rotatePattern(this.#patterns.get("N"), 5));
    this.#patterns.set("S", rotatePattern(this.#patterns.get("E"), 5));
    this.#patterns.set("W", rotatePattern(this.#patterns.get("S"), 5));

    this.#patterns.set("NE", [
      [6, 6, 1, 6, 6],
      [6, 1, 1, 1, 6],
      [6, 1, 1, 1, 1],
      [6, 1, 1, 1, 6],
      [6, 6, 6, 6, 6],
    ]);
    this.#patterns.set("ES", rotatePattern(this.#patterns.get("NE"), 5));
    this.#patterns.set("SW", rotatePattern(this.#patterns.get("ES"), 5));
    this.#patterns.set("NW", rotatePattern(this.#patterns.get("SW"), 5));

    this.#patterns.set("NS", [
      [6, 6, 1, 6, 6],
      [6, 1, 1, 1, 6],
      [6, 1, 1, 1, 6],
      [6, 1, 1, 1, 6],
      [6, 6, 1, 6, 6],
    ]);
    this.#patterns.set("EW", rotatePattern(this.#patterns.get("NS"), 5));

    this.#patterns.set("NES", [
      [6, 6, 1, 6, 6],
      [6, 1, 1, 1, 6],
      [6, 1, 1, 1, 1],
      [6, 1, 1, 1, 6],
      [6, 6, 1, 6, 6],
    ]);
    this.#patterns.set("ESW", rotatePattern(this.#patterns.get("NES"), 5));
    this.#patterns.set("NSW", rotatePattern(this.#patterns.get("ESW"), 5));
    this.#patterns.set("NEW", rotatePattern(this.#patterns.get("NSW"), 5));

    this.#patterns.set("NESW", [
      [6, 6, 1, 6, 6],
      [6, 1, 1, 1, 6],
      [1, 1, 1, 1, 1],
      [6, 1, 1, 1, 6],
      [6, 6, 1, 6, 6],
    ]);
  }

  /**
   * get the pattern for the given key
   * @param {string} key 
   * @returns {number[][]} the pattern for the given key
   */

  get(key) {
    if (this.#patterns.has(key)) {
      return this.#patterns.get(key);
    }else{
        throw new Error(`PatternSet: No pattern for key ${key}`);
    }
  }
}
