import { defineConfig } from 'eslint/config'
import { configs, parser } from 'typescript-eslint'

const config = defineConfig({
  name: 'innodoc/typescript',
  files: ['**/*.{ts,tsx}'],
  extends: [configs.strictTypeChecked, configs.stylisticTypeChecked],
  languageOptions: {
    parser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    // Prefer interfaces for type definitions
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

    // Consistent use of type imports
    '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],

    // Indentation is handled by prettier (https://typescript-eslint.io/rules/indent/)
    '@typescript-eslint/indent': 'off',

    // Allow annotating this parameter of functions
    '@typescript-eslint/no-invalid-void-type': ['error', { allowAsThisParameter: true }],

    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        // Ban relative parent imports (import/no-relative-parent-imports gives false positives for '#' aliases)
        patterns: [
          {
            group: ['../*'],
            message:
              'Usage of relative parent imports is not allowed. Use `#` subpath aliases instead (https://nodejs.org/api/packages.html#subpath-imports).',
          },
        ],

        paths: [
          // Warn when using hooks from react-redux directly
          {
            name: 'react-redux',
            importNames: ['useSelector', 'useDispatch'],
            message: 'Use typed hooks `useDispatch` and `useSelector` from `@innodoc/ui-store` instead.',
          },
          // Warn when using `Icon` from @mui/material directly
          {
            name: '@mui/material',
            importNames: ['Icon'],
            message: 'Use `#ui/components/common/Icon` instead.',
          },
        ],
      },
    ],
  },
})

export default config
