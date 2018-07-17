const withSass = require('@zeit/next-sass')
const Dotenv = require('dotenv-webpack')

module.exports = withSass({
  // only use .js (not .jsx)
  pageExtensions: ['js'],

  // css modules with local scope
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },

  // webpack
  webpack: (config) => {
    config.plugins.push(new Dotenv({
      path: `${__dirname}/.env`,
    }))
    return config
  },
})
