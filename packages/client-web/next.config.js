const path = require('path')
const Dotenv = require('dotenv-webpack')
const AntdScssThemePlugin = require('antd-scss-theme-plugin')
const withLess = require('@zeit/next-less')
const withSass = require('@zeit/next-sass')
const nextBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const withTranspileModules = require('next-transpile-modules')

const rootDir = path.resolve(__dirname, '..', '..')

// babel rootMode for monorepo support
const rootMode = 'upward'

const addAntdScssThemePlugin = (config) => {
  const patchLoader = (type) => {
    config.module.rules
      .filter((rule) => Array.isArray(rule.use))
      .map((rule) => rule.use.find((loader) => loader.loader === `${type}-loader`))
      .filter((use) => use)
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
    .filter((rule) => Array.isArray(rule.use))
    .map((rule) => rule.use)
    .filter((use) => use.some((loader) => loader.loader === 'less-loader'))
    .map((use) => use
      .filter((loader) => typeof loader === 'object')
      .find((loader) => loader.loader.startsWith('css-loader')))
    .forEach((loader) => { loader.options.modules = false })

  // replace sass/less-loaders with AntdScssThemePlugin
  patchLoader('sass')
  patchLoader('less')

  const antdThemeFile = path.resolve(__dirname, 'src', 'style', 'antd-theme.sass')
  config.plugins.push(new AntdScssThemePlugin(antdThemeFile))
}

// update next.js webpack config
const patchWebpackConfig = (config) => {
  config.plugins.push(new Dotenv({
    path: path.resolve(rootDir, '.env'),
    safe: path.resolve(rootDir, '.env.example'),
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

  // We must not include '*.test.js' files in the build
  config.module.rules.push({
    test: /\.test\.js$/,
    loader: 'ignore-loader',
  })

  addAntdScssThemePlugin(config)

  // add rootMode to next-babel-loader
  config.module.rules
    .filter(
      (rule) => (
        rule.use
        && rule.use.loader
        && rule.use.loader === 'next-babel-loader'
      )
    )
    .forEach((rule) => { rule.use.options.rootMode = rootMode })

  // debug print webpack config
  /* eslint-disable-next-line no-extend-native */
  // Object.defineProperty(RegExp.prototype, 'toJSON', { value: RegExp.prototype.toString })
  // console.log(JSON.stringify(config.module.rules, null, 2))

  return config
}

// next.js configuration
const nextConfig = {
  pageExtensions: ['js'], // only use .js (not .jsx)

  lessLoaderOptions: {
    javascriptEnabled: true, // needed by antd less code
  },

  // css modules with local scope (for component sass styles)
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },

  // transpile local modules
  transpileModules: [
    '@innodoc/client-misc',
    '@innodoc/client-sagas',
    '@innodoc/client-store',
  ],

  // custom webpack config
  webpack: patchWebpackConfig,
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
  const bundleAnalyzerBasePath = path.join(__dirname, 'bundle-analyzer')
  nextConfig.analyzeServer = ['server', 'both'].includes(process.env.BUNDLE_ANALYZE)
  nextConfig.analyzeBrowser = ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE)
  nextConfig.bundleAnalyzerConfig = {
    server: {
      analyzerMode: 'static',
      reportFilename: path.join(bundleAnalyzerBasePath, 'server.html'),
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: path.join(bundleAnalyzerBasePath, 'client.html'),
    },
  }
  return nextBundleAnalyzer(config)
}

module.exports = process.env.BUNDLE_ANALYZE
  ? withBundleAnalyzer(wrappedNextConfig(nextConfig))
  : wrappedNextConfig(nextConfig)
