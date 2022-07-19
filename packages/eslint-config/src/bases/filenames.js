module.exports = {
  plugins: ['filenames'],
  rules: {
    'filenames/match-exported': 'off',
    'filenames/match-regex': 'error',
    'filenames/no-index': 'error',
  },
  overrides: [
    {
      files: ['**/+(jest|next|next-i18next|postcss|prettier).config.+(cjs|js)', '**/.eslintrc.cjs'],
      rules: {
        'filenames/match-regex': 'off',
      },
    },
  ],
}
