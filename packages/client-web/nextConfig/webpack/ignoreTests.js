module.exports = (config) =>
  config.module.rules.push({
    test: /\.test\.js$/,
    loader: 'ignore-loader',
  })
