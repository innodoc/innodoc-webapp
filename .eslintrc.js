module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
  },
  plugins: ['jest'],
  rules: {
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
    }],
    'function-paren-newline': ['off'],
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/no-disabled-tests': 'off',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'jsx-a11y/anchor-is-valid': ['off'],
    'react/jsx-filename-extension': ['error', {
      extensions: ['.js'],
    }],
    'react/forbid-prop-types': ['off'],
    semi: ['error', 'never'],
  },
}
