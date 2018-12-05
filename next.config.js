const path = require('path')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const withPlugins = require('next-compose-plugins')
const Dotenv = require('dotenv-webpack')
const AntdScssThemePlugin = require('antd-scss-theme-plugin')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const withLess = require('@zeit/next-less')
const withSass = require('@zeit/next-sass')

const addAntdScssThemePlugin = (config) => {
  const patchLoader = (type) => {
    config.module.rules
      .filter(rule => Array.isArray(rule.use))
      .map(rule => rule.use.find(loader => loader.loader === `${type}-loader`))
      .filter(use => use)
      .forEach((use) => {
        const antdScss = AntdScssThemePlugin.themify({
          loader: `${type}-loader`,
          options: use.options,
        })
        /* eslint-disable no-param-reassign */
        use.loader = antdScss.loader
        use.options = antdScss.options
      })
  }

  // no CSS module for less
  config.module.rules
    .filter(rule => Array.isArray(rule.use))
    .map(rule => rule.use)
    .filter(use => use.some(loader => loader.loader === 'less-loader'))
    .map(use => use
      .filter(loader => typeof loader === 'object')
      .find(loader => loader.loader.startsWith('css-loader')))
    .forEach((loader) => { loader.options.modules = false })

  // replace sass/less-loaders with AntdScssThemePlugin
  patchLoader('sass')
  patchLoader('less')

  const antdThemeFile = path.join(__dirname, 'src', 'style', 'antd-theme.sass')
  config.plugins.push(new AntdScssThemePlugin(antdThemeFile))
}

// update next.js webpack config
const patchWebpackConfig = (config) => {
  config.plugins.push(new Dotenv({
    path: path.join(__dirname, '.env'),
    safe: true,
    systemvars: true,
  }))

  // images, fonts
  config.module.rules.push({
    test: /\.(png|woff2)$/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 32 * 1024,
        publicPath: '../',
        outputPath: 'static/',
        name: '[name].[hash:8].[ext]',
      },
    },
  })

  // svg icons
  config.module.rules.push({
    test: /\.svg$/,
    use: [
      {
        loader: 'babel-loader',
      },
      {
        loader: '@svgr/webpack',
        options: {
          babel: false,
          icon: true,
        },
      },
    ],
  })


  addAntdScssThemePlugin(config)

  // debug print webpack config
  /* eslint-disable-next-line no-extend-native */
  // Object.defineProperty(RegExp.prototype, 'toJSON', { value: RegExp.prototype.toString })
  // console.log(JSON.stringify(config.module.rules, null, 2))

  return config
}

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

  webpack: patchWebpackConfig,
}

// next.js configuration plugins
const plugins = [
  [withBundleAnalyzer, [PHASE_DEVELOPMENT_SERVER]],
  withLess,
  withSass,
]

module.exports = withPlugins(plugins, nextConfig)
