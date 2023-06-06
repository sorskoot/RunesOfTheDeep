import { DirectionSymbol } from "../../types/index.js";
import { Grid } from "../grid.js";

const NEIGHBOR_OFFSETS = [
  { x: -1, y: 0, z: 0, name: "west" },
  { x: 1, y: 0, z: 0, name: "east" },
  { x: 0, y: -1, z: 0, name: "down" },
  { x: 0, y: 1, z: 0, name: "up" },
  { x: 0, y: 0, z: -1, name: "south" },
  { x: 0, y: 0, z: 1, name: "north" },
];

/**
 *
 * @param {Grid} grid
 * @param {{x:number,y:number,z:number}} position
 * @returns {{x:number,y:number,z:number}[]}
 */
export function getNeighbors(grid: Grid, position: { x: number; y: number; }): { x: number; y: number; }[] {
  const width = grid.sizeX;
  const height = grid.sizeY;

  const neighbors = [];

  for (const offset of NEIGHBOR_OFFSETS) {
    const newX = position.x + offset.x;
    const newY = position.y + offset.y;

    if (
      newX >= 0 &&
      newX < width &&
      newY >= 0 &&
      newY < height 
    ) {
      neighbors.push({ x: newX, y: newY, name: offset.name });
    }
  }

  return neighbors;
}

/**
 * Inverts a direction
 * @param {DirectionSymbol} direction Direction to invert
 * @returns {DirectionSymbol} Inverted Direction
 */
export function getInvertedDirection(direction:DirectionSymbol):DirectionSymbol{
    switch(direction){
        case "N": return "S";
        case "S": return "N";
        case "E": return "W";
        case "W": return "E";
    }
}
