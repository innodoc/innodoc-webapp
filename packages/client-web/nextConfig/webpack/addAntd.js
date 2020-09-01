const { execSync } = require('child_process')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const ANT_STYLE_REGEXP = /(antd\/.*?\/style).*(?<![.]js)$/
const LESS_FILE_REGEXP = /\.less$/
let extractCssInitialized = false

// Extract antd default vars to JSON file and return modifyVars
// const getModifyVars = () => {
//   const prepareScript = path.resolve(__dirname, 'addAntdPrebuild.js')
//   const output = execSync(`node ${prepareScript}`).toString()
//   try {
//     return JSON.parse(output)
//   } catch (e) {
//     // eslint-disable-next-line no-console
//     console.error(`${e}\n${output}`)
//   }
//   return undefined
// }
// const modifyVars = getModifyVars()
const modifyVars = {}

module.exports = (config, { dev, isServer }) => {
  if (!isServer) {
    // eslint-disable-next-line no-param-reassign
    config.optimization.splitChunks.cacheGroups.styles = {
      name: 'antd',
      test: LESS_FILE_REGEXP,
      chunks: 'all',
      enforce: true,
    }

    if (!extractCssInitialized) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: dev ? 'static/css/[name].css' : 'static/css/[name].[contenthash:8].css',
          chunkFilename: dev
            ? 'static/css/[name].chunk.css'
            : 'static/css/[name].[contenthash:8].chunk.css',
        })
      )
      extractCssInitialized = true
    }
  }

  const loaders = isServer
    ? [require.resolve('ignore-loader')]
    : [
        dev && require.resolve('extracted-loader'),
        MiniCssExtractPlugin.loader,
        {
          loader: require.resolve('css-loader'),
          options: {
            modules: false,
            sourceMap: dev,
            importLoaders: 2,
          },
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            config: {
              path: path.resolve(__dirname, 'postcss.config.js'),
            },
          },
        },
        {
          loader: require.resolve('less-loader'),
          options: {
            lessOptions: {
              javascriptEnabled: true,
              modifyVars,
            },
          },
        },
      ].filter(Boolean)

  config.module.rules.push({
    test: LESS_FILE_REGEXP,
    use: loaders,
  })

  if (isServer) {
    const origExternals = [...config.externals]
    // eslint-disable-next-line no-param-reassign
    config.externals = [
      (context, request, callback) => {
        if (request.match(ANT_STYLE_REGEXP)) {
          return callback()
        }
        if (typeof origExternals[0] === 'function') {
          origExternals[0](context, request, callback)
        } else {
          callback()
        }
        return undefined
      },
      ...(typeof origExternals[0] === 'function' ? [] : origExternals),
    ]

    config.module.rules.unshift({
      test: ANT_STYLE_REGEXP,
      use: require.resolve('null-loader'),
    })
  }
}
