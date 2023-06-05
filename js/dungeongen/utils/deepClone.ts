export function deepClone(value) {
    if (Array.isArray(value)) {
      return value.map(deepClone);
    } else if (typeof value === 'object' && value !== null) {
      const clonedObj = Object.create(Object.getPrototypeOf(value));
      for (const key in value) {
        clonedObj[key] = deepClone(value[key]);
      }
      return clonedObj;
    } else {
      return value;
    }
  }