const path = require('path')
const Dotenv = require('dotenv-webpack')
const AntdScssThemePlugin = require('antd-scss-theme-plugin')
const withLess = require('@zeit/next-less')
const withSass = require('@zeit/next-sass')
const nextBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const withTranspileModules = require('next-transpile-modules')

const nodeModulesEs = require('./nodeModulesEs')

// babel rootMode for monorepo support
const rootMode = 'upward'

// used to override ant design theme variables
const antdThemeFile = path.resolve(__dirname, 'src', 'style', 'antd-theme.sass')

// update next.js webpack config
const webpack = (prevConfig) => {
  const config = { ...prevConfig }

  const dotEnvFile = path.resolve(__dirname, '..', '..', '.env')
  config.plugins.push(new Dotenv({
    path: dotEnvFile,
    safe: `${dotEnvFile}.example`,
    systemvars: true,
  }))

  config.plugins.push(new AntdScssThemePlugin(antdThemeFile))

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
        options: { rootMode },
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

  // do not include '*.test.js' files in the build
  config.module.rules.push({
    test: /\.test\.js$/,
    loader: 'ignore-loader',
  })

  // disable CSS modules for less
  for (let i = 0; i < config.module.rules.length; i += 1) {
    const rule = config.module.rules[i]
    if (Array.isArray(rule.use)) {
      if (rule.use.some((loader) => loader.loader === 'less-loader')) {
        for (let j = 0; j < rule.use.length; j += 1) {
          const use = rule.use[j]
          if (typeof use === 'object' && use.loader.startsWith('css-loader')) {
            use.options.modules = false
          }
        }
      }
    }
  }

  // replace sass/less-loaders with AntdScssThemePlugin
  const loaderTypes = ['sass', 'less']
  for (let i = 0; i < loaderTypes.length; i += 1) {
    for (let j = 0; j < config.module.rules.length; j += 1) {
      const rule = config.module.rules[j]
      if (Array.isArray(rule.use)) {
        for (let k = 0; k < rule.use.length; k += 1) {
          const use = rule.use[k]
          const loader = `${loaderTypes[i]}-loader`
          if (use.loader === loader) {
            const antdScss = AntdScssThemePlugin.themify({
              loader,
              options: use.options,
            })
            use.loader = antdScss.loader
            use.options = antdScss.options
          }
        }
      }
    }
  }

  // Add rootMode to next-babel-loader. This is important so sub-package babel
  // is picking up the root babel.config.js.
  for (let i = 0; i < config.module.rules.length; i += 1) {
    const rule = config.module.rules[i]
    if (rule.use && rule.use.loader && rule.use.loader === 'next-babel-loader') {
      rule.use.options.rootMode = rootMode
    }
  }

  // debug print webpack config
  if (process.env.PRINT_WEBPACK_CONFIG) {
    /* eslint-disable-next-line no-extend-native */
    Object.defineProperty(RegExp.prototype, 'toJSON', { value: RegExp.prototype.toString })
    /* eslint-disable-next-line no-console */
    console.log(JSON.stringify(config, null, 2))
  }

  return config
}

// next.js configuration
const nextConfig = {
  pageExtensions: ['js'], // only use .js (not .jsx)

  // needed by antd less code
  lessLoaderOptions: { javascriptEnabled: true },

  // GZIP compression should happen in reverse proxy
  compress: false,

  // css modules with local scope (for component sass styles)
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },

  transpileModules: [
    // local modules
    '@innodoc/client-misc',
    '@innodoc/client-sagas',
    '@innodoc/client-store',
    // ES6 node modules
    ...nodeModulesEs,
  ],

  // custom webpack config
  webpack,
}

const wrappedNextConfig = (config) => (
  withLess(
    withSass(
      withTranspileModules(
        config
      )
    )
  )
)

// bundle analyzer (set BUNDLE_ANALYZE=both to enable)
const withBundleAnalyzer = (config) => {
  const newConfig = { ...config }
  const bundleAnalyzerBasePath = path.join(__dirname, 'bundle-analyzer')
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

module.exports = process.env.BUNDLE_ANALYZE
  ? withBundleAnalyzer(wrappedNextConfig(nextConfig))
  : wrappedNextConfig(nextConfig)
