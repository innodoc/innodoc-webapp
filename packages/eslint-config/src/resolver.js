const { builtinModules } = require('module')
const path = require('path')

function resolve(source, file) {
  if (builtinModules.includes(source)) {
    return { found: true, path: null }
  }

  try {
    return { found: true, path: require.resolve(source, { paths: [path.dirname(file)] }) }
  } catch (err) {
    return { found: false }
  }
}

module.exports = {
  interfaceVersion: 2,
  resolve,
}
