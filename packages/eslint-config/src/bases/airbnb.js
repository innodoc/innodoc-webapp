const baseConfig = require('./baseConfig.js')

module.exports = {
  ...baseConfig,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb', 'airbnb/hooks', 'plugin:react/jsx-runtime'],
  settings: {
    react: { version: 'detect' },
  },
}
