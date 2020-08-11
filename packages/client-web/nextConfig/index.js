const withSugarSS = require('next-sugarss')
const withTranspileModules = require('next-transpile-modules')

const nodeModulesEs = require('./nodeModulesEs')
const withBundleAnalyzer = require('./withBundleAnalyzer')
const options = require('./options')

// Order of wrappers affects the order of the stylesheets
const config = withSugarSS(
  withTranspileModules([
    // Monorepo modules
    '@innodoc/client-misc',
    '@innodoc/client-question-validators',
    '@innodoc/client-sagas',
    '@innodoc/client-store',
    // ES6 node modules
    ...nodeModulesEs,
  ])(options)
)

module.exports = process.env.BUNDLE_ANALYZE ? withBundleAnalyzer(config) : config
