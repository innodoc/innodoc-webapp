const cssLoaderConfig = require('@zeit/next-css/css-loader-config')
const withSass = require('@zeit/next-sass')
const Dotenv = require('dotenv-webpack')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const path = require('path')

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

module.exports = withBundleAnalyzer(
  withSass(
    withLessWithoutCssModules(
      {
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

        // Adapt webpack config
        webpack: (config) => {
          // Inject dotenv config vars
          config.plugins.push(new Dotenv({
            path: `${__dirname}/.env`,
            safe: true,
            systemvars: true,
          }))

          // Custom Semantic UI build
          // SUI assets
          config.module.rules.push({
            test: /\.(png|svg|eot|ttf|woff|woff2)$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 8 * 1024, // 8 KiB
                publicPath: '../',
                outputPath: 'static/',
                name: '[name].[hash:8].[ext]',
              },
            },
          })
          // Hack to make SUI find our custom theme
          config.resolve.alias['../../theme.config$'] = path.join(
            __dirname, 'src', 'semantic-ui', 'theme.config')

          return config
        },
      }
    )
  )
)
