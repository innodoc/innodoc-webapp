module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['airbnb-base', 'prettier'],
  parser: '@babel/eslint-parser',
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
    'prettier/prettier': 'error',
  },
}
