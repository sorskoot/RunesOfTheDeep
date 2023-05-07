import { Grid } from "../grid";

const NEIGHBOR_OFFSETS = [
    { x: -1, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 0, z: -1 },
    { x: 0, y: 0, z: 1 },
  ];

/**
 * 
 * @param {Grid} grid 
 * @param {{x:number,y:number,z:number}} position 
 * @returns 
 */
export function getNeighbors(grid, position) {
  const width = grid.sizeX;
  const height =  grid.sizeY;
  const depth =  grid.sizeZ;

  const neighbors = [];

  for (const offset of NEIGHBOR_OFFSETS) {
    const newX = position.x + offset.x;
    const newY = position.y + offset.y;
    const newZ = position.z + offset.z;

    if (
      newX >= 0 &&
      newX < width &&
      newY >= 0 &&
      newY < height &&
      newZ >= 0 &&
      newZ < depth
    ) {
      neighbors.push({ x: newX, y: newY, z: newZ });
    }
  }

  return neighbors;
}
