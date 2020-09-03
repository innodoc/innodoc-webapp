const { execSync } = require('child_process')
const path = require('path')
const withTranspileModules = require('next-transpile-modules')

const nodeModulesEs = require('./nodeModulesEs.json')
const withBundleAnalyzer = require('./withBundleAnalyzer')
const options = require('./options')
const pkgInfo = require('../package.json')

// Copy MathJax fonts
const copyScript = path.resolve(__dirname, 'copyMathJaxFonts.js')
execSync(`yarn node ${copyScript}`)

const workspacePackages = Object.entries(pkgInfo.dependencies).reduce(
  (acc, [name, ver]) => (ver.startsWith('workspace:packages/') ? [...acc, name] : acc),
  []
)

const config = withTranspileModules([
  ...workspacePackages,
  ...nodeModulesEs, // ES6 node modules
])(options)

module.exports = process.env.BUNDLE_ANALYZE ? withBundleAnalyzer(config) : config
