const { execSync } = require('child_process')
const path = require('path')
const withLess = require('next-with-less')
// const withTranspileModules = require('next-transpile-modules')

// const nodeModulesEs = require('./nodeModulesEs.json') // TODO: fix this, check all used libs
const withBundleAnalyzer = require('./withBundleAnalyzer')
const config = require('./config')
// const pkgInfo = require('../package.json')

module.exports = (phase, { defaultConfig }) => {
  // Copy MathJax fonts
  const copyScript = path.resolve(__dirname, 'copyMathJaxFonts.js')
  execSync(`yarn node ${copyScript}`)

  // Custom config
  let customConfig = config(phase, { defaultConfig })

  // Transpile modules
  // TODO: next-transpile-modules works with SWC?
  // const workspacePackages = Object.entries(pkgInfo.dependencies).reduce(
  //   (acc, [name, ver]) => (ver.startsWith('workspace:packages/') ? [...acc, name] : acc),
  //   []
  // )
  // const withTMConfig = withTranspileModules([
  //   ...workspacePackages,
  //   ...nodeModulesEs, // ES6 node modules
  // ])(customConfig)

  customConfig.lessLoaderOptions = {
    lessOptions: {
      modifyVars: {
        'primary-color': '#9900FF',
      },
    },
  }
  customConfig = withLess(customConfig)

  // return process.env.BUNDLE_ANALYZE ? withBundleAnalyzer(withTMConfig) : withTMConfig
  return process.env.BUNDLE_ANALYZE ? withBundleAnalyzer(customConfig) : customConfig
}
