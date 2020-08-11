const path = require('path')
const nextBundleAnalyzer = require('@zeit/next-bundle-analyzer')

// Set BUNDLE_ANALYZE=both to enable
module.exports = (config) => {
  const newConfig = { ...config }
  const bundleAnalyzerBasePath = path.join(__dirname, '..', 'bundle-analyzer')
  newConfig.analyzeServer = ['server', 'both'].includes(process.env.BUNDLE_ANALYZE)
  newConfig.analyzeBrowser = ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE)
  newConfig.bundleAnalyzerConfig = {
    server: {
      analyzerMode: 'static',
      reportFilename: path.join(bundleAnalyzerBasePath, 'server.html'),
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: path.join(bundleAnalyzerBasePath, 'client.html'),
    },
  }
  return nextBundleAnalyzer(newConfig)
}
