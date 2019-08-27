const esLintNoExtraneousDependenciesConfig = require('@innodoc/tools/esLintNoExtraneousDependenciesConfig')
const baseConfig = require('../../.eslintrc')

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    ...esLintNoExtraneousDependenciesConfig(__dirname),
  },
  overrides: [
    {
      files: [
        'src/components/content/ContentFragment/**/*.js',
      ],
      rules: {
        'import/no-cycle': 'off',
      },
    },
  ],
}
