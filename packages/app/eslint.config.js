import innodocConfig from '@innodoc/eslint-config'

/** @type {import("eslint").Linter.FlatConfig} */
const config = [
  ...innodocConfig,

  // Filename rule exceptions
  {
    files: [
      'vite.config.ts',
      // vite-plugin-ssr files
      'src/pages/**/*.page*.ts',
      'src/renderer/_+(default|error).page*.ts',
    ],
    rules: {
      'filenames/match-exported': 'off',
      'filenames/match-regex': 'off',
    },
  },
]

export default config
