const esLintNoExtraneousDependenciesConfig = require('@innodoc/tools/esLintNoExtraneousDependenciesConfig')
const baseConfig = require('../../.eslintrc')

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    ...esLintNoExtraneousDependenciesConfig(__dirname),
    'no-console': ['off'],
  },
}
