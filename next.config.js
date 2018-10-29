const path = require('path')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const withPlugins = require('next-compose-plugins')
const cssLoaderConfig = require('@zeit/next-css/css-loader-config')
const Dotenv = require('dotenv-webpack')
const AntdScssThemePlugin = require('antd-scss-theme-plugin')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')

// modified version of @zeit/next-less
// - withSassWithAntdScss
// - disable CSS modules
const withLessAntdScssNoCssModules = (nextConfig = {}) => ({
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

    /* eslint-disable-next-line no-param-reassign */
    options.defaultLoaders.less = cssLoaderConfig(config, {
      extensions: ['less'],
      cssModules,
      cssLoaderOptions,
      postcssLoaderOptions,
      dev,
      isServer,
      loaders: [
        AntdScssThemePlugin.themify({
          loader: 'less-loader',
          options: lessLoaderOptions,
        }),
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

// modified version of @zeit/next-sass that adds AntdScssThemePlugin
const withSassAntdScss = (nextConfig = {}) => ({
  ...nextConfig,
  webpack(config, options) {
    const { dev, isServer } = options
    const {
      cssModules,
      cssLoaderOptions,
      postcssLoaderOptions,
      sassLoaderOptions = {},
    } = nextConfig

    /* eslint-disable-next-line no-param-reassign */
    options.defaultLoaders.sass = cssLoaderConfig(config, {
      extensions: ['scss', 'sass'],
      cssModules,
      cssLoaderOptions,
      postcssLoaderOptions,
      dev,
      isServer,
      loaders: [
        AntdScssThemePlugin.themify({
          loader: 'sass-loader',
          options: sassLoaderOptions,
        }),
      ],
    })

    config.module.rules.push(
      {
        test: /\.scss$/,
        use: options.defaultLoaders.sass,
      },
      {
        test: /\.sass$/,
        use: options.defaultLoaders.sass,
      }
    )

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options)
    }

    return config
  },
})

// next.js configuration plugins
const plugins = [
  [withBundleAnalyzer, [PHASE_DEVELOPMENT_SERVER]],
  withLessAntdScssNoCssModules,
  withSassAntdScss,
]

// next.js configuration
const nextConfig = {
  // only use .js (not .jsx)
  pageExtensions: ['js'],

  lessLoaderOptions: {
    javascriptEnabled: true, // needed by antd less code
  },

  // css modules with local scope (for component sass styles)
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },

  // bundle analyzer (set BUNDLE_ANALYZE to enable!)
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
      path: path.join(__dirname, '.env'),
      safe: true,
      systemvars: true,
    }))

    config.plugins.push(new AntdScssThemePlugin(path.join(__dirname, './src/style/antd-theme.sass')))

    // web fonts
    config.module.rules.push({
      test: /\.woff2$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '../',
          outputPath: 'static/',
          name: '[name].[hash:8].[ext]',
        },
      },
    })

    // debug print webpack config
    /* eslint-disable-next-line no-extend-native */
    // Object.defineProperty(RegExp.prototype, 'toJSON', { value: RegExp.prototype.toString })
    // console.log(JSON.stringify(config, null, 2))

    return config
  },
}

module.exports = withPlugins(plugins, nextConfig)
