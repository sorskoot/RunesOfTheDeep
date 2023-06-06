// Function to rotate a pattern 90 degrees clockwise
export function rotatePattern(pattern: any[][], patternSize: number) {
  let rotatedPattern:any[] = [];
  for (let i = 0; i < patternSize; i++) {
    rotatedPattern.push([]);
    for (let j = patternSize - 1; j >= 0; j--) {
      rotatedPattern[i].push(pattern[j][i]);
    }
  }
  return rotatedPattern;
}

export function extractPatterns2D(input: string | any[], patternSize: number) {
  const width = input[0].length;
  const height = input.length;

  let patterns = new Map();

  for (let y = 0; y <= height - patternSize; y++) {
    for (let x = 0; x <= width - patternSize; x++) {
      let basePattern = [];

      for (let i = 0; i < patternSize; i++) {
        let row = [];
        for (let j = 0; j < patternSize; j++) {
          row.push(input[y + i][x + j]);
        }
        basePattern.push(row);
      }

      let currentPattern= basePattern;
      // Rotate and add the pattern to the map
      // for (let r = 0; r < 4; r++) {
      //   // Four cardinal directions

      //   if (r !== 0) {
      //     currentPattern = rotatePattern(currentPattern,patternSize);
      //   }

      let key = JSON.stringify(currentPattern);

        if (!patterns.has(key)) {
          patterns.set(key, { pattern: currentPattern, weight: 1 });
        } else {
          let value = patterns.get(key);
          value.weight += 1;
          patterns.set(key, value);
        }
      //}
    }
  }

  return Array.from(patterns.values());
}

export function extractPatternsWrap(input: string | any[], patternSize: number) {
  const width = input[0].length;
  const height = input.length;

  let patterns = new Map();

  for (let y = 0; y < height ; y++) {
    for (let x = 0; x < width; x++) {
      let basePattern = [];

      for (let i = 0; i < patternSize; i++) {
        let row = [];
        for (let j = 0; j < patternSize; j++) {
          row.push(input[(x + i)% height][(y + j)%width]);
        }
        basePattern.push(row);
      }

      let currentPattern= basePattern;
      // Rotate and add the pattern to the map
      // for (let r = 0; r < 4; r++) {
      //   // Four cardinal directions

      //   if (r !== 0) {
      //     currentPattern = rotatePattern(currentPattern,patternSize);
      //   }

        let key = JSON.stringify(currentPattern);

        if (!patterns.has(key)) {
          patterns.set(key, { pattern: currentPattern, weight: 1 });
        } else {
          let value = patterns.get(key);
          value.weight += 1;
          patterns.set(key, value);
        }
      //}
    }
  }

  return Array.from(patterns.values());
}

export function extractPatterns3D(input: string | any[], patternSize: number) {
  const width = input[0][0].length;
  const height = input[0].length;
  const depth = input.length;

  let patterns = new Map();

  for (let z = 0; z <= depth - patternSize; z++) {
    for (let y = 0; y <= height - patternSize; y++) {
      for (let x = 0; x <= width - patternSize; x++) {
        let pattern = [];

        for (let i = 0; i < patternSize; i++) {
          let layer = [];
          for (let j = 0; j < patternSize; j++) {
            let row = [];
            for (let k = 0; k < patternSize; k++) {
              row.push(input[z + i][y + j][x + k]);
            }
            layer.push(row);
          }
          pattern.push(layer);
        }

        let key = JSON.stringify(pattern);

        if (!patterns.has(key)) {
          patterns.set(key, { pattern: pattern, count: 1 });
        } else {
          let value = patterns.get(key);
          value.count += 1;
          patterns.set(key, value);
        }
      }
    }
  }
}

export function checkConstraints(patternA: string | any[], patternB: any[][]) {
  const size = patternA.length;

  // Check top
  let topMatch = true;
  for (let i = 0; i < size; i++) {
    
    if (patternA[i][0] !== patternB[i][size - 1]) {
      topMatch = false;
      break;
    }
  }

  // Check bottom
  let bottomMatch = true;
  for (let i = 0; i < size; i++) {
    if (patternA[i][size - 1] !== patternB[i][0]) {
      bottomMatch = false;
      break;
    }
  }

  // Check left
  let leftMatch = true;
  for (let j = 0; j < size; j++) {
    if (patternA[0][j] !== patternB[size - 1][j]) {
      leftMatch = false;
      break;
    }
  }

  // Check right
  let rightMatch = true;
  for (let j = 0; j < size; j++) {
    if (patternA[size - 1][j] !== patternB[0][j]) {
      rightMatch = false;
      break;
    }
  }

  return { north: topMatch, south: bottomMatch, west: leftMatch, east: rightMatch };
}

// export function buildConstraintsMap(patterns: any[]) {
//   const constraintsMap = new Map();

//   patterns.forEach((patternDataA: { pattern: any; }, keyA: any) => {
//     let constraintsObjectPerPatternDirectionWise = {};

//     patterns.forEach((patternDataB: { pattern: any; }, keyB: any) => {
//       const constraintsBetweenPatterns = checkConstraints(
//         patternDataA.pattern,
//         patternDataB.pattern
//       );

//       //check all direction and store accordingly

//       Object.keys(constraintsBetweenPatterns).forEach((direction) => {
//         if (constraintsBetweenPatterns[direction]) {
//           if (!constraintsObjectPerPatternDirectionWise[direction])
//             constraintsObjectPerPatternDirectionWise[direction] = [keyB];
//           else constraintsObjectPerPatternDirectionWise[direction].push(keyB);
//         }
//       });
//     });

//     constraintsMap.set(keyA, constraintsObjectPerPatternDirectionWise);
//   });

//   return constraintsMap;
// }
