const baseConfig = require('../../.eslintrc')

module.exports = {
  ...baseConfig,
  plugins: [...baseConfig.plugins, 'testing-library'],
}
