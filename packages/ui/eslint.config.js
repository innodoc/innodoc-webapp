import typescriptParser from '@typescript-eslint/parser'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRedux from 'eslint-plugin-react-redux'

import innodocConfig from '@innodoc/eslint-config'

// Restricted imports
const restrictedImportsRules = {
  'no-restricted-imports': 'off',
  '@typescript-eslint/no-restricted-imports': [
    'error',
    {
      paths: [
        // Warn when using hooks from react-redux directly
        {
          name: 'react-redux',
          importNames: ['useSelector', 'useDispatch'],
          message:
            'Use typed hooks `useDispatch` and `useSelector` from `@innodoc/store/redux` instead.',
        },
        // Warn when using hooks from react-redux directly
        {
          name: '@mui/material',
          importNames: ['Icon'],
          message: 'Use `#ui/components/common/Icon` instead.',
        },
      ],
    },
  ],
}

// Allow to "omit" props using destructuring w/o having them marked as "unused"
const allowOmitPropsRules = {
  '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
}

/** @type {import("eslint").Linter.FlatConfig} */
const config = [
  ...innodocConfig,
  {
    files: ['src/**/*.tsx'],
    plugins: {
      'jsx-a11y': jsxA11y,
      react,
      'react-hooks': reactHooks,
      'react-redux': reactRedux,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ...react.configs.recommended.parserOptions,
        ...react.configs['jsx-runtime'].parserOptions,
        ecmaVersion: 2023,
        project: true,
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // Plugin configs
      ...jsxA11y.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...reactRedux.configs.recommended.rules,

      // Custom rules
      ...restrictedImportsRules,
      ...allowOmitPropsRules,
    },
  },
]

export default config
