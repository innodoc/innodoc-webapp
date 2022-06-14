const reactPkgInfo = require('react/package.json')
const eslintNoExtraneousDependenciesConfig = require('@innodoc/common/eslintNoExtraneousDependenciesConfig')
const baseConfig = require('../../.eslintrc')

module.exports = {
  ...baseConfig,
  extends: ['airbnb', 'plugin:prettier/recommended'],
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
    {
      files: ['src/**/*.test.js'],
      globals: {
        waitForComponent: true,
      },
      rules: {
        'react/prop-types': 'off',
      },
    },
    {
      files: ['nextConfig/**/*.js'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: reactPkgInfo.version,
    },
  },
}
