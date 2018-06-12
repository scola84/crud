export default function checkRoute(object, options) {
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === 'string' && object[key].match(/undefined/)) {
      console.warn(`Route is corrupt: ${key} contains undefined`,
        object, options);
    }
  });
}
