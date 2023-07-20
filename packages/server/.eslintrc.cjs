module.exports = {
  root: true,
  extends: ['@innodoc/eslint-config'],
  overrides: [
    // Ignore knex-specific files
    {
      files: ['knexfile.ts', 'src/database/migrations/*.ts'],
      rules: {
        'filenames/match-exported': 'off',
        'filenames/match-regex': 'off',
      },
    },
  ],
}
