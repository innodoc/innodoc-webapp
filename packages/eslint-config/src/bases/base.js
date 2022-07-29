const path = require('path')

module.exports = {
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: ['**/.cache'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    // Avoid a real .babelrc which makes Next.js disable SWC
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: ['@babel/preset-env'],
    },
  },
  settings: {
    react: { version: 'detect' },
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
        // https://github.com/typescript-eslint/typescript-eslint/issues/1824
        '@typescript-eslint/indent': 'off',

        // Warn when using hooks from react-redux directly
        // https://redux.js.org/usage/usage-with-typescript#use-typed-hooks-in-components
        'no-restricted-imports': 'off',
        '@typescript-eslint/no-restricted-imports': [
          'warn',
          {
            name: 'react-redux',
            importNames: ['useSelector', 'useDispatch'],
            message:
              'Use typed hooks `useDispatch` and `useSelector` from `@innodoc/store` instead.',
          },
        ],
      },
    },
  ],
}
