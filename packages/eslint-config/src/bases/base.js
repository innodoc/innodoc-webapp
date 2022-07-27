const path = require('path')

module.exports = {
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: ['**/.cache'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    // Avoid a real .babelrc which would confuse Next.js
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: ['@babel/preset-env'],
    },
  },

  // TypeScript sources
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        project: path.resolve(__dirname, '..', '..', '..', '..', 'tsconfig.json'),
        tsconfigRootDir: path.resolve(__dirname, '..', '..', '..', '..'),
      },
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/indent': 'off',
      },
    },
  ],
}
