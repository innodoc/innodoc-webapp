const prettierConfig = require('../prettier.config.js')

module.exports = {
  extends: ['plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', prettierConfig],
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
  },
}
