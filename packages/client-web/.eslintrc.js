const eslintNoExtraneousDependenciesConfig = require('@innodoc/client-misc/src/eslintNoExtraneousDependenciesConfig')
const baseConfig = require('../../.eslintrc')

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    ...eslintNoExtraneousDependenciesConfig(__dirname),
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
