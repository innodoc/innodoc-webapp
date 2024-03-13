import innodocConfig from '@innodoc/eslint-config'

/** @type {import("eslint").Linter.FlatConfig} */
const config = [
  ...innodocConfig,

  // Filename rule exceptions
  {
    files: ['src/migrations/*.ts'],
    rules: {
      'filenames/match-exported': 'off',
      'filenames/match-regex': 'off',
    },
  },
]

export default config
