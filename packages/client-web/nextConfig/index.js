const withCss = require('@zeit/next-css')
const withLess = require('@zeit/next-less')
const withTranspileModules = require('next-transpile-modules')

const withBundleAnalyzer = require('./withBundleAnalyzer')
const options = require('./options')

// Next.js configuration
const config = withLess(withCss(withTranspileModules(options)))

module.exports = process.env.BUNDLE_ANALYZE
  ? withBundleAnalyzer(config)
  : config
