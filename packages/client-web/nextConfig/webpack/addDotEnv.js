const path = require('path')
const Dotenv = require('dotenv-webpack')

const DOTENV_FILE = path.resolve(__dirname, '..', '..', '..', '..', '.env')

module.exports = (config) =>
  config.plugins.push(
    new Dotenv({
      path: DOTENV_FILE,
      safe: `${DOTENV_FILE}.example`,
      systemvars: true,
    })
  )
