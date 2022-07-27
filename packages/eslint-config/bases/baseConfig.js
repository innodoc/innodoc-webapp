// Not exported, only internally to share common base config
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: ['**/.cache'],
  // eslint does not work with SWC yet (https://github.com/swc-project/swc/issues/246)
  // parser stuff taken from next.js
  parser: 'eslint-config-next/parser.js',
  parserOptions: {
    requireConfigFile: false,
    sourceType: 'module',
    allowImportExportEverywhere: true,
    babelOptions: {
      presets: ['next/babel'],
      caller: { supportsTopLevelAwait: true },
    },
  },
}
