import dayjs from "dayjs";
import isValidDate from "./isValidDate";

type NestedObject = {
  [key: string]: any;
};

export function flattenObject(obj: NestedObject): NestedObject {
  const result: NestedObject = {};

  function flatten(obj: NestedObject, prefix = "") {
    for (let key in obj) {
      if (
        typeof obj[key] === "object" &&
        !isValidDate(obj[key]) &&
        obj[key] !== null
      ) {
        flatten(obj[key], prefix + key + ".");
      } else {
        if (isValidDate(obj[key])) {
          result[key] = dayjs(obj[key]).format("MMM DD, YYYY hh:mm a");
        }
        {
          result[prefix + key] = obj[key];
        }
      }
    }
  }

  flatten(obj);
  return result;
}

export function flattenObjectWithoutPrefix(obj: NestedObject): NestedObject {
  const result: NestedObject = {};

  function flatten(obj: NestedObject) {
    for (let key in obj) {
      if (
        typeof obj[key] === "object" &&
        !isValidDate(obj[key]) &&
        obj[key] !== null
      ) {
        flatten(obj[key]);
      } else {
        if (isValidDate(obj[key])) {
          result[key] = dayjs(obj[key]).format("MMM DD, YYYY hh:mm a");
        } else {
          result[key] = obj[key];
        }
      }
    }
  }

  flatten(obj);
  return result;
}
