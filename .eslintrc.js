module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
  },
  plugins: ['jest', 'prettier'],
  root: true,
  rules: {
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/no-disabled-tests': 'off',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'jsx-a11y/anchor-is-valid': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.js'],
      },
    ],
    'react/forbid-prop-types': 'off',
    'prettier/prettier': 'error',
  },
}
