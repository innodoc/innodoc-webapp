const withSugarSS = require('./next-sugarss')
const withTranspileModules = require('next-transpile-modules')

const nodeModulesEs = require('./nodeModulesEs.json')
const withBundleAnalyzer = require('./withBundleAnalyzer')
const options = require('./options')
const pkgInfo = require('../package.json')

const workspacePackages = Object.entries(pkgInfo.dependencies).reduce(
  (acc, [name, ver]) => (ver.startsWith('workspace:packages/') ? [...acc, name] : acc),
  []
)

// Order of wrappers affects the order of the stylesheets
const config = withSugarSS(
  withTranspileModules([
    ...workspacePackages,
    ...nodeModulesEs, // ES6 node modules
  ])(options)
)

module.exports = process.env.BUNDLE_ANALYZE ? withBundleAnalyzer(config) : config
