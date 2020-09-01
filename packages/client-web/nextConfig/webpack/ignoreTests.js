module.exports = (config) =>
  config.module.rules.push({
    test: /\.test\.js$/,
    loader: require.resolve('ignore-loader'),
  })
