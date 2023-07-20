module.exports = {
  root: true,
  extends: ['@innodoc/eslint-config'],
  overrides: [
    {
      files: [
        // vite config
        'vite.config.ts',
        // vite-plugin-ssr files
        'src/pages/**/*.+(ts|tsx)',
        'src/renderer/_+(default|error).page*.+(ts|tsx)',
      ],
      rules: {
        'filenames/match-exported': 'off',
        'filenames/match-regex': 'off',
      },
    },
  ],
}
