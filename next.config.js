const withSass = require('@zeit/next-sass')
const Dotenv = require('dotenv-webpack')

// css modules with local scope
module.exports = withSass({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  },
  webpack: config => {
    config.plugins.push(new Dotenv({
      path: `${__dirname}/.env`,
    }))
    return config
  },
})
