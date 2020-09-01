const eslintNoExtraneousDependenciesConfig = require('@innodoc/common/eslintNoExtraneousDependenciesConfig')
const baseConfig = require('../../.eslintrc')

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    ...eslintNoExtraneousDependenciesConfig(__dirname),
  },
}
