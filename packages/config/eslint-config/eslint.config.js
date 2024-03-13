import eslintJs from '@eslint/js'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import typescriptEslint from 'typescript-eslint'

import jsConfig from './jsConfig.js'
import testConfig from './testConfig.js'
import tsConfig from './tsConfig.js'
import tsxConfig from './tsxConfig.js'

const config = typescriptEslint.config(
  eslintJs.configs.recommended,
  ...typescriptEslint.configs.strictTypeChecked,
  ...typescriptEslint.configs.stylisticTypeChecked,
  eslintPluginUnicorn.configs['flat/recommended'],
  ...tsConfig,
  ...tsxConfig,
  ...jsConfig,
  ...testConfig,
  {
    ignores: ['.cache', 'dist', 'coverage', 'node_modules'],
  },
)

export default config
