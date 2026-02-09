// Patch @next/env default export for tsx CJS interop
const Module = require("module");
const origLoad = Module._load;
Module._load = function (request, parent, isMain) {
  const result = origLoad.call(this, request, parent, isMain);
  if (request === "@next/env" && result && !result.default) {
    result.default = result;
  }
  return result;
};
