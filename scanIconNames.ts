/**
 * Finds all `<Icon name="..." />` components and extacts `name` attribute from
 * source code tree.
 */

import path from 'path'

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils'
import { isNodeOfType } from '@typescript-eslint/utils/dist/ast-utils'
import { ESLint } from 'eslint'

const isJSXIdentifier = isNodeOfType(AST_NODE_TYPES.JSXIdentifier)
const isJSXAttribute = isNodeOfType(AST_NODE_TYPES.JSXAttribute)
const isLiteral = isNodeOfType(AST_NODE_TYPES.Literal)

const PLUGIN_NAME = 'eslint-scan-icon-names'
const RULE_NAME = 'icon-name'

async function scanIconNames() {
  // Collect icon names
  const iconNames = new Set<string>()

  // Custom plugin
  const plugin: ESLint.Plugin = {
    rules: {
      [RULE_NAME]: ESLintUtils.RuleCreator.withoutDocs({
        create() {
          return {
            JSXElement(node) {
              // <Icon /> tags
              if (
                node.openingElement.selfClosing &&
                isJSXIdentifier(node.openingElement.name) &&
                node.openingElement.name.name === 'Icon'
              ) {
                // name attritbute
                node.openingElement.attributes
                  .filter(isJSXAttribute)
                  .filter((a) => a.name.name === 'name')
                  .forEach((attribute) => {
                    if (isLiteral(attribute.value) && typeof attribute.value.value === 'string') {
                      iconNames.add(attribute.value.value)
                    }
                  })
              }
            },
          }
        },
        defaultOptions: [],
        meta: { messages: { default: '' }, type: 'suggestion', schema: {} },
      }),
    },
  }

  // Create eslint instance
  const eslint = new ESLint({
    extensions: ['.ts', '.tsx'],
    overrideConfig: {
      parser: '@typescript-eslint/parser',
      plugins: [PLUGIN_NAME],
      rules: { [`${PLUGIN_NAME}/${RULE_NAME}`]: 'warn' },
    },
    // Hack to load custom plugin
    // https://github.com/eslint/eslint/issues/15453#issuecomment-1001200953
    plugins: { [PLUGIN_NAME]: plugin },
    useEslintrc: false,
  })

  // Scan files
  await eslint.lintFiles([path.join(__dirname, 'src/**/*.tsx')])

  return Array.from(iconNames)
}

export default scanIconNames
