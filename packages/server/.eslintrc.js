const eslintNoExtraneousDependenciesConfig = require('@innodoc/tools/eslintNoExtraneousDependenciesConfig')
const baseConfig = require('../../.eslintrc')

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    ...eslintNoExtraneousDependenciesConfig(__dirname),
    'no-console': ['off'],
  },
}
