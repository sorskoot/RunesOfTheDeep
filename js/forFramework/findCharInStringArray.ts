/**
 * Finds a character in a string array and returns its coordinates
 * @param {string[]} grid 
 * @param {string} targetChar 
 * @returns {{x: number, y: number} | null} the coordinates of the character in the grid
 */
export function findCharInStringArray(grid: string[], targetChar: string): { x: number; y: number; } | null {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === targetChar) {
        return { x: x, y: y };
      }
    }
  }

  // If the character is not found, return null
  return null;
}