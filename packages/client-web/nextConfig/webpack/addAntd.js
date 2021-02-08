const { execSync } = require('child_process')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const ANT_STYLE_REGEXP = /(antd\/.*?\/style).*(?<![.]js)$/
const LESS_FILE_REGEX = /\.less$/

// Extract antd default vars to JSON file and return modifyVars
const getModifyVars = () => {
  const prepareScript = path.resolve(__dirname, 'addAntdPrebuild.js')
  const output = execSync(`yarn node ${prepareScript}`).toString()
  try {
    return JSON.parse(output)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`${e}\n${output}`)
  }
  return undefined
}
const modifyVars = getModifyVars()

module.exports = (config, { dev, isServer }) => {
  const loaders = isServer
    ? [require.resolve('null-loader')]
    : [
        {
          loader: MiniCssExtractPlugin.loader,
        },
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
            postcssOptions: {
              config: path.resolve(__dirname, '..', 'postcss.config.js'),
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
      ]

  config.module.rules.push({
    test: LESS_FILE_REGEX,
    use: loaders,
  })

  // Exclude antd from server bundle
  if (isServer) {
    const origExternals = [...config.externals]
    // eslint-disable-next-line no-param-reassign
    config.externals = [
      (context, request, callback) => {
        if (request.match(ANT_STYLE_REGEXP)) {
          // Continue without externalizing the import
          return callback()
        }
        if (typeof origExternals[0] === 'function') {
          origExternals[0](context, request, callback)
        } else {
          callback()
        }
        return undefined
      },
    ]

    config.module.rules.unshift({
      test: ANT_STYLE_REGEXP,
      use: require.resolve('null-loader'),
    })
  }
}
