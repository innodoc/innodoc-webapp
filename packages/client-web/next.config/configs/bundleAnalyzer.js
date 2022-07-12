const path = require('path')

module.exports = async (phase, nextConfig = {}) => {
  const { default: BundleAnalyzerPlugin } = await import('webpack-bundle-analyzer')

  return {
    ...nextConfig,
    webpack: (config, options) => {
      const reportFilename = path.resolve(
        __dirname,
        '..',
        '..',
        'analyze',
        options.isServer ? 'server.html' : 'client.html'
      )
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true,
          reportFilename,
        })
      )

      return typeof nextConfig.webpack === 'function' ? nextConfig.webpack(config, options) : config
    },
  }
}
