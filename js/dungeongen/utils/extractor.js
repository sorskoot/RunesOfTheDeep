export function extractPatterns(input, patternSize) {
  const width = input[0].length;
  const height = input.length;

  let patterns = new Map();

  for (let y = 0; y <= height - patternSize; y++) {
    for (let x = 0; x <= width - patternSize; x++) {
      let pattern = [];

      for (let i = 0; i < patternSize; i++) {
        let row = [];
        for (let j = 0; j < patternSize; j++) {
          row.push(input[y + i][x + j]);
        }
        pattern.push(row);
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

  return Array.from(patterns.values());
}

export function extractPatterns3D(input, patternSize) {
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

export function checkConstraints(patternA, patternB) {
    const size = patternA.length;
  
    // Check top
    let topMatch = true;
    for (let i = 0; i < size; i++) {
      if (patternA[0][i] !== patternB[size - 1][i]) {
        topMatch = false;
        break;
      }
    }
  
    // Check bottom
    let bottomMatch = true;
    for (let i = 0; i < size; i++) {
      if (patternA[size - 1][i] !== patternB[0][i]) {
        bottomMatch = false;
        break;
      }
    }
  
    // Check left
    let leftMatch = true;
    for (let j = 0; j < size; j++) {
      if (patternA[j][0] !== patternB[j][size - 1]) {
        leftMatch = false;
        break;
      }
    }
  
     // Check right
     let rightMatch = true;
     for (let j = 0; j < size; j++) {
       if (patternA[j][size -1] !== patternB[j][0]) {
         rightMatch = false;
         break;
       }
     }
  
     return {north: topMatch, south: bottomMatch, west: leftMatch, east: rightMatch};
  }
  
export function buildConstraintsMap(patterns) {
     const constraintsMap = new Map();
  
     patterns.forEach((patternDataA, keyA) => {
  
        let constraintsObjectPerPatternDirectionWise ={};
  
          patterns.forEach((patternDataB,keyB)=>{
  
          const constraintsBetweenPatterns=checkConstraints(patternDataA.pattern,patternDataB.pattern);
  
          //check all direction and store accordingly
  
          Object.keys(constraintsBetweenPatterns).forEach(direction=>{
            if(constraintsBetweenPatterns[direction])
            { 
              if (!constraintsObjectPerPatternDirectionWise[direction]) constraintsObjectPerPatternDirectionWise[direction] =[keyB];
                  else constraintsObjectPerPatternDirectionWise[direction].push(keyB);
              };
          })
  
         });
  
         constraintsMap.set(keyA,constraintsObjectPerPatternDirectionWise); 
        
  });
     
     return constraintsMap;
  
  }