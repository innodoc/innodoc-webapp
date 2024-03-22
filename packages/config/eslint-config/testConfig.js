import eslintPluginJestDom from 'eslint-plugin-jest-dom'
import eslintPluginTestingLibrary from 'eslint-plugin-testing-library'
import eslintPluginVitest from 'eslint-plugin-vitest'
import eslintPluginVitestGlobals from 'eslint-plugin-vitest-globals'
import typescriptEslint from 'typescript-eslint'

const testConfig = typescriptEslint.config(
  {
    files: ['**/*.test.{ts,tsx}'],
    extends: [eslintPluginJestDom.configs['flat/recommended']],
    languageOptions: {
      globals: eslintPluginVitestGlobals.environments.env.globals,
    },
    plugins: {
      vitest: eslintPluginVitest,
      'testing-library': eslintPluginTestingLibrary,
    },
    rules: {
      ...eslintPluginVitest.configs.recommended.rules,
      ...eslintPluginTestingLibrary.configs.react.rules,
    },
    settings: {
      'testing-library/utils-module': '@innodoc/rtl',
    },
  },
  {
    files: ['tests/**/*'],
    rules: {
      'filenames/match-exported': 'off',
      'filenames/match-regex': 'off',
    },
  },
)

export default testConfig
