import { defineConfig, globalIgnores } from 'eslint/config'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

import baseConfig from './base.js'
import nodeConfig from './node.js'
import playwrightConfig from './playwright.js'
import reactConfig from './react.js'
import testConfig from './test.js'
import typescriptConfig from './typescript.js'

/** @typedef {import('eslint').Linter.Config} Config */

const ignores = globalIgnores(['.cache/*', 'dist/*', 'coverage/*', 'node_modules/*', '.turbo/*'])

/**
 * Factory to create a consistent ESLint configuration
 *
 * @param {(Config | Config[])[]} configs - An array of config objects or arrays of objects
 */
function makeConfig(...configs) {
  return defineConfig([
    ignores,
    baseConfig,
    ...(configs ? configs.flat() : []),
    // Recommended last so that it can override other configs
    prettierRecommended,
  ])
}

const backendConfig = makeConfig(nodeConfig, testConfig, typescriptConfig)
const e2eConfig = makeConfig(playwrightConfig, testConfig, typescriptConfig)
const frontendConfig = makeConfig(nodeConfig, reactConfig, testConfig, typescriptConfig)
const toolConfig = makeConfig(nodeConfig, typescriptConfig)

export { backendConfig, e2eConfig, frontendConfig, toolConfig }
export default makeConfig
