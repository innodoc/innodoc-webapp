import innodocConfig from '@innodoc/eslint-config'

/** @type {import("eslint").Linter.FlatConfig} */
const config = [
  ...innodocConfig,

  // Filename rule exceptions
  {
    files: ['knexfile.ts', 'src/database/migrations/*.ts'],
    rules: {
      'filenames/match-exported': 'off',
      'filenames/match-regex': 'off',
    },
  },
]

export default config
