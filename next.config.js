const withSass = require('@zeit/next-sass')
const Dotenv = require('dotenv-webpack')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')

module.exports = withBundleAnalyzer(withSass({
  // only use .js (not .jsx)
  pageExtensions: ['js'],

  // css modules with local scope
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },

  // bundle analyzer
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../../bundles/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html',
    },
  },

  // webpack
  webpack: (config) => {
    config.plugins.push(new Dotenv({
      path: `${__dirname}/.env`,
      safe: true,
      systemvars: true,
    }))
    return config
  },
}))
