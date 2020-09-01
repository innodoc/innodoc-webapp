module.exports = (config) =>
  config.module.rules.push({
    test: /\.svg$/,
    use: [
      {
        loader: require.resolve('@svgr/webpack'),
        options: {
          icon: true,
        },
      },
    ],
  })
