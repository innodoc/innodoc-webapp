module.exports = (config) => {
  config.module.rules.push({
    test: /\.woff2$/,
    use: [
      {
        loader: require.resolve('file-loader'),
        options: {
          emitFile: false,
          publicPath: '/fonts/',
          name: '[name].[ext]',
        },
      },
    ],
  })
}
