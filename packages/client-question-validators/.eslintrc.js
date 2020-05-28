const eslintNoExtraneousDependenciesConfig = require('@innodoc/client-misc/src/eslintNoExtraneousDependenciesConfig')
const baseConfig = require('../../.eslintrc')

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    ...eslintNoExtraneousDependenciesConfig(__dirname),
  },
  globals: {
    createTests: true,
  },
}
