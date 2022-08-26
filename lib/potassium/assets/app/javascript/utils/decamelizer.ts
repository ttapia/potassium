// From https://github.com/domchristie/humps/issues/51#issuecomment-425113505
/* eslint-disable complexity */
/* eslint-disable max-statements */
import { decamelize } from 'humps';

interface objectToDecamelize {
  [key: string]: unknown
}

function decamelizeThatDoesNotBreakFiles(object: objectToDecamelize): unknown {
  if (object && !(object instanceof File)) {
    if (object instanceof Array) {
      return object.map(item => decamelizeThatDoesNotBreakFiles(item));
    }
    if (object instanceof FormData) {
      const formData = new FormData();
      for (const [key, value] of object.entries()) {
        formData.append(decamelize(key), value);
      }

      return formData;
    }
    if (typeof object === 'object') {
      return Object.keys(object).reduce((acc, next) => ({
        ...acc,
        [decamelize(next)]: decamelizeThatDoesNotBreakFiles(object[next] as objectToDecamelize),
      }), {});
    }
  }

  return object;
}

export default decamelizeThatDoesNotBreakFiles;
