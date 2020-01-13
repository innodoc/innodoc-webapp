const eslintNoExtraneousDependenciesConfig = require('@innodoc/client-misc/src/eslintNoExtraneousDependenciesConfig')
const baseConfig = require('../../.eslintrc')

module.exports = {
  ...baseConfig,
  plugins: [...baseConfig.plugins, 'react-hooks'],
  rules: {
    ...baseConfig.rules,
    ...eslintNoExtraneousDependenciesConfig(__dirname),
    'jsx-a11y/anchor-is-valid': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.js'],
      },
    ],
    'react/forbid-prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: [
    {
      files: ['src/components/content/ContentFragment/**/*.js'],
      rules: {
        'import/no-cycle': 'off',
      },
    },
  ],
}
