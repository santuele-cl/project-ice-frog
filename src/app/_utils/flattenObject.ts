type NestedObject = {
  [key: string]: any;
};

export function flattenObject(obj: NestedObject): NestedObject {
  const result: NestedObject = {};

  function flatten(obj: NestedObject, prefix = "") {
    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        flatten(obj[key], prefix + key + ".");
      } else {
        result[prefix + key] = obj[key];
      }
    }
  }

  flatten(obj);
  return result;
}
