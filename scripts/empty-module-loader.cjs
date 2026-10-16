/** Drop Next's baseline polyfill. Those features already exist in the browsers we ship to. */
module.exports = function emptyModuleLoader() {
  return "module.exports = {};\n";
};
