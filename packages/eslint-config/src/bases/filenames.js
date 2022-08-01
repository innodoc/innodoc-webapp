module.exports = {
  plugins: ['filenames'],
  rules: {
    'filenames/match-exported': 'error',
    // Allow camelCase.js + PascalCase.js filenames
    'filenames/match-regex': ['error', '^[A-Za-z][a-z0-9]*(?:[A-Z][a-z0-9]*)*(?:[A-Z]?)$', false],
    // No index.js as it makes searching for files horrible
    'filenames/no-index': 'error',
  },
  overrides: [
    {
      files: ['**/+(jest|postcss|prettier).config.+(cjs|js)', '**/.eslintrc.cjs', '**/*-env.d.ts'],
      rules: {
        'filenames/match-regex': 'off',
      },
    },

    {
      files: ['**/*.d.ts'],
      rules: {
        'filenames/match-exported': 'off',
        'filenames/match-regex': 'off',
      },
    },
  ],
}
