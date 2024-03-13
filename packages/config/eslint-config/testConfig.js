import eslintPluginVitest from 'eslint-plugin-vitest'
import eslintPluginVitestGlobals from 'eslint-plugin-vitest-globals'
import typescriptEslint from 'typescript-eslint'

const testConfig = typescriptEslint.config({
  files: ['**/*.test.{ts,tsx}'],
  languageOptions: {
    globals: eslintPluginVitestGlobals.environments.env.globals,
  },
  plugins: {
    vitest: eslintPluginVitest,
  },
  rules: {
    ...eslintPluginVitest.configs.recommended.rules,
    'filenames/match-regex': 'off',
  },
})

export default testConfig
