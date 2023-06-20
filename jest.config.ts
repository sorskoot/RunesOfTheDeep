import type { JestConfigWithTsJest } from 'ts-jest'

//import { defaults as tsjPreset } from 'ts-jest/presets'
import { defaultsESM as tsjPreset } from 'ts-jest/presets';
// import { jsWithTs as tsjPreset } from 'ts-jest/presets';
// import { jsWithTsESM as tsjPreset } from 'ts-jest/presets';
// import { jsWithBabel as tsjPreset } from 'ts-jest/presets';
// import { jsWithBabelESM as tsjPreset } from 'ts-jest/presets';

const jestConfig: JestConfigWithTsJest = {
  // [...]
  transform: {
    ...tsjPreset.transform,
    // [...]
  },
  moduleNameMapper:{
    "~js/(.*)": "<rootDir>/js/$1"
  }
}

export default jestConfig