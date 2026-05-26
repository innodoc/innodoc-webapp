import { defineConfig } from 'oxfmt'

export default defineConfig({
  arrowParens: 'always',
  endOfLine: 'lf',
  printWidth: 120,
  semi: false,
  singleQuote: true,

  sortImports: {
    newlinesBetween: false,

    customGroups: [
      {
        groupName: 'innodoc',
        elementNamePattern: ['@innodoc/**'],
      },
      {
        groupName: 'subpath',
        elementNamePattern: ['#/**'],
      },
    ],

    groups: [
      'type-import',
      ['value-builtin', 'value-external'],
      ['type-internal', 'value-internal', 'innodoc'],
      ['subpath', 'value-parent', 'value-sibling', 'value-index'],
      'unknown',
    ],
  },

  ignorePatterns: ['dist/**'],
})
