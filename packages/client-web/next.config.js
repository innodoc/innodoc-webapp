/* eslint-disable no-console */

const path = require('path')
const { execSync } = require('child_process')
const Dotenv = require('dotenv-webpack')
const withCss = require('@zeit/next-css')
const withLess = require('@zeit/next-less')
const nextBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const withTranspileModules = require('next-transpile-modules')

const nodeModulesEs = require('./nodeModulesEs')

// babel rootMode for monorepo support
const rootMode = 'upward'

// extract antd default vars to JSON file and prepare overridden vars
const prepareScript = path.resolve(__dirname, 'preBuild.js')
const antdVars = JSON.parse(execSync(`node ${prepareScript}`).toString())

// update next.js webpack config
const webpack = (prevConfig) => {
  const config = { ...prevConfig }

  const dotEnvFile = path.resolve(__dirname, '..', '..', '.env')
  config.plugins.push(new Dotenv({
    path: dotEnvFile,
    safe: `${dotEnvFile}.example`,
    systemvars: true,
  }))

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

  for (let i = 0; i < config.module.rules.length; i += 1) {
    const rule = config.module.rules[i]

    // disable CSS modules for less
    if (Array.isArray(rule.use) && rule.use.some((loader) => loader.loader === 'less-loader')) {
      for (let j = 0; j < rule.use.length; j += 1) {
        const use = rule.use[j]
        if (typeof use === 'object' && use.loader.startsWith('css-loader')) {
          use.options.modules = false
        }
      }
    }

    // use .sss extension for css-loader
    if (rule.test.source.match('css')) {
      rule.test = /\.sss$/
    }

    // Add rootMode to next-babel-loader. This is important so sub-package babel
    // is picking up the root babel.config.js.
    if (rule.use && rule.use.loader && rule.use.loader === 'next-babel-loader') {
      rule.use.options.rootMode = rootMode
    }

    // disable CSS minimize (performed by cssnano)
    if (Array.isArray(rule.use)) {
      for (let j = 0; j < rule.use.length; j += 1) {
        const use = rule.use[j]
        if (typeof use === 'object' && use.loader.startsWith('css-loader')) {
          use.options.minimize = false
        }
      }
    }
  }

  // TODO remove!
  // only for use-mathjax lib development, to force one version of react
  config.resolve.alias.react = path.resolve('../../node_modules/react')

  // debug print webpack config
  if (process.env.PRINT_WEBPACK_CONFIG) {
    /* eslint-disable-next-line no-extend-native */
    Object.defineProperty(RegExp.prototype, 'toJSON', { value: RegExp.prototype.toString })
    console.log(JSON.stringify(config.module.rules, null, 2))
  }

  return config
}

// next.js configuration
const nextConfig = {
  pageExtensions: ['js'], // only use .js (not .jsx)

  lessLoaderOptions: {
    // needed by antd less code
    javascriptEnabled: true,
    // pass custom variables to antd
    modifyVars: antdVars,
  },

  // GZIP compression should happen in reverse proxy
  compress: false,

  // css modules with local scope
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
    withCss(
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
