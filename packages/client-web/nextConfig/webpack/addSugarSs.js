const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const SSS_FILE_REGEX = /\.sss$/

module.exports = (config, { dev, isServer }) => {
  const loaders = [
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 1,
        modules: {
          exportOnlyLocals: isServer,
          localIdentName: '[local]___[hash:base64:5]',
        },
        sourceMap: dev,
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
  ]

  if (!isServer) {
    loaders.unshift({
      loader: MiniCssExtractPlugin.loader,
      options: { hmr: dev },
    })
  }

  config.module.rules.push({
    test: SSS_FILE_REGEX,
    issuer(issuer) {
      if (issuer.match(/pages[\\/]_document\.js$/)) {
        throw new Error(
          'You can not import CSS files in pages/_document.js, use pages/_app.js instead.'
        )
      }
      return true
    },
    use: loaders,
  })
}
