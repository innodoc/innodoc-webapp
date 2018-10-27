const path = require('path')
const cssLoaderConfig = require('@zeit/next-css/css-loader-config')
// const withLess = require('@zeit/next-less')
const withSass = require('@zeit/next-sass')
const Dotenv = require('dotenv-webpack')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')

/* eslint no-param-reassign: ["error", { "props": false }] */

// modified version of @zeit/next-less without CSS modules
const withLessWithoutCssModules = (nextConfig = {}) => ({
  ...nextConfig,
  webpack(config, options) {
    const { dev, isServer } = options
    const {
      postcssLoaderOptions,
      lessLoaderOptions = {},
    } = nextConfig

    // no modules!
    const cssModules = false
    const cssLoaderOptions = {}

    options.defaultLoaders.less = cssLoaderConfig(config, {
      extensions: ['less'],
      cssModules,
      cssLoaderOptions,
      postcssLoaderOptions,
      dev,
      isServer,
      loaders: [
        {
          loader: 'less-loader',
          options: lessLoaderOptions,
        },
      ],
    })

    config.module.rules.push({
      test: /\.less$/,
      use: options.defaultLoaders.less,
    })

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options)
    }

    return config
  },
})

module.exports = withBundleAnalyzer(withLessWithoutCssModules(withSass({
  // only use .js (not .jsx)
  pageExtensions: ['js'],

  lessLoaderOptions: {
    javascriptEnabled: true,
  },

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
})))
