const { execSync } = require('child_process')
const path = require('path')
const withTranspileModules = require('next-transpile-modules')

const nodeModulesEs = require('./nodeModulesEs.json')
const withBundleAnalyzer = require('./withBundleAnalyzer')
const config = require('./config')
const pkgInfo = require('../package.json')

module.exports = (phase, { defaultConfig }) => {
  // Copy MathJax fonts
  const copyScript = path.resolve(__dirname, 'copyMathJaxFonts.js')
  execSync(`yarn node ${copyScript}`)

  // Custom config
  const customConfig = config(phase, { defaultConfig })

  // Transpile modules
  const workspacePackages = Object.entries(pkgInfo.dependencies).reduce(
    (acc, [name, ver]) => (ver.startsWith('workspace:packages/') ? [...acc, name] : acc),
    []
  )
  const withTMConfig = withTranspileModules([
    ...workspacePackages,
    ...nodeModulesEs, // ES6 node modules
  ])(customConfig)

  return process.env.BUNDLE_ANALYZE ? withBundleAnalyzer(withTMConfig) : withTMConfig
}
