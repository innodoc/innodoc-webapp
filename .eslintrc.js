module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 13,
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
