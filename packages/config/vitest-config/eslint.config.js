import innodocConfig from '@innodoc/eslint-config'

const config = [
  ...innodocConfig,
  {
    files: ['src/*'],
    rules: {
      'filenames/match-exported': 'off',
      'filenames/match-regex': 'off',
    },
  },
]

export default config
