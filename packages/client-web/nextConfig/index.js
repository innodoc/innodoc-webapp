const withLess = require('@zeit/next-less')
const withSugarSS = require('next-sugarss')
const withTranspileModules = require('next-transpile-modules')

const withBundleAnalyzer = require('./withBundleAnalyzer')
const options = require('./options')

// Order of wrappers affects the order of the stylesheets
const config = withSugarSS(withLess(withTranspileModules(options)))

module.exports = process.env.BUNDLE_ANALYZE
  ? withBundleAnalyzer(config)
  : config
