import { AST_NODE_TYPES, ASTUtils, ESLintUtils } from '@typescript-eslint/utils'
import { ESLint, type Rule } from 'eslint'

const isJSXIdentifier = ASTUtils.isNodeOfType(AST_NODE_TYPES.JSXIdentifier)
const isJSXAttribute = ASTUtils.isNodeOfType(AST_NODE_TYPES.JSXAttribute)
const isLiteral = ASTUtils.isNodeOfType(AST_NODE_TYPES.Literal)

const PLUGIN_NAME = 'eslint-scan-icon-names'
const RULE_NAME = 'icon-name'

/**
 * Finds all `<Icon name="..." />` components and extacts `name` attribute from
 * source code tree.
 */
async function scanIconNames(paths: string[]) {
  // Collect icon names
  const iconNames = new Set<string>()

  const rule = ESLintUtils.RuleCreator.withoutDocs({
    create() {
      return {
        JSXElement(node) {
          // <Icon /> tags
          if (
            node.openingElement.selfClosing &&
            isJSXIdentifier(node.openingElement.name) &&
            node.openingElement.name.name.endsWith('Icon')
          ) {
            // name attribute
            for (const attr of node.openingElement.attributes) {
              if (
                isJSXAttribute(attr) &&
                attr.name.name === 'name' &&
                isLiteral(attr.value) &&
                typeof attr.value.value === 'string'
              ) {
                iconNames.add(attr.value.value)
              }
            }
          }
          // All other components
          else {
            // iconName attribute
            for (const attr of node.openingElement.attributes) {
              if (
                isJSXAttribute(attr) &&
                attr.name.name === 'iconName' &&
                isLiteral(attr.value) &&
                typeof attr.value.value === 'string'
              ) {
                iconNames.add(attr.value.value)
              }
            }
          }
        },
      }
    },
    defaultOptions: [],
    meta: {
      messages: { default: '' },
      type: 'suggestion',
      schema: [],
    },
  }) as unknown as Rule.RuleModule

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
    plugins: {
      [PLUGIN_NAME]: {
        rules: { [RULE_NAME]: rule },
      },
    },
    useEslintrc: false,
  })

  // Scan files
  await eslint.lintFiles(paths)

  return [...iconNames]
}

export default scanIconNames
