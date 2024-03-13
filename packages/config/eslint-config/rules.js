const groupWithTypes = (re) => [re, `${re}.*\\u0000$`]

const rules = {
  eslint: {
    // Enforce all block statements to be wrapped in curly braces
    curly: 'error',

    // disable as we're using @typescript-eslint/no-restricted-imports
    'no-restricted-imports': 'off',

    // Checked by TypeScript
    'no-dupe-class-members': 'off',
    'no-undef': 'off', // https://typescript-eslint.io/troubleshooting/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
  },

  filenames: {
    // Exported name must match filename
    'filenames/match-exported': 'error',

    // Allow camelCase + PascalCase filenames
    'filenames/match-regex': ['error', '^[A-Za-z][a-z0-9]*(?:[A-Z][a-z0-9]*)*(?:[A-Z]?)$', false],

    // No index files as it makes searching for files horrible
    'filenames/no-index': 'error',
  },

  // nx: {
  //   '@nx/enforce-module-boundaries': [
  //     'error',
  //     {
  //       enforceBuildableLibDependency: true,
  //       allow: [],
  //       depConstraints: [
  //         {
  //           sourceTag: '*',
  //           onlyDependOnLibsWithTags: ['*'],
  //         },
  //       ],
  //     },
  //   ],
  // },

  import: {
    // TypeScript provides the same checks
    // https://typescript-eslint.io/linting/troubleshooting/performance-troubleshooting#eslint-plugin-import
    'import/named': 'off',
    'import/namespace': 'off',
    'import/default': 'off',
    'import/no-named-as-default-member': 'off',

    // Doesn't work well with subpath imports
    'import/extensions': 'off',

    // Turn on errors for missing imports
    'import/no-unresolved': 'error',

    // Import order setup
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },

  prettier: {
    'prettier/prettier': 'error',
  },

  regexp: {
    // ignore exponential and polynomial backtracking
    'regexp/no-super-linear-backtracking': 'off',
  },

  simpleImportSort: {
    'simple-import-sort/imports': [
      'error',
      {
        // custom groups with type imports last in each group
        // https://github.com/lydell/eslint-plugin-simple-import-sort#custom-grouping
        groups: [
          ['^\\u0000'], // side-effects
          groupWithTypes('^node:'), // node modules
          groupWithTypes('^@?(?:(?!innodoc\\/))\\w'), // 3rd party imports
          groupWithTypes('^@innodoc\\/'),
          ['(?<!\\u0000)$'], // absolute imports
          groupWithTypes('^#'), // subpath exports
          groupWithTypes('^\\.'), // relative imports
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
  },

  typescript: {
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
            message: 'Use typed hooks `useDispatch` and `useSelector` from `@innodoc/store/redux` instead.',
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
  },

  unicorn: {
    'unicorn/filename-case': 'off', // covered by 'filenames/*' rules
    'unicorn/no-null': 'off',
    'unicorn/prefer-export-from': 'off', // collides with simple-import-sort
    'unicorn/prevent-abbreviations': 'off',
  },
}

export default rules
