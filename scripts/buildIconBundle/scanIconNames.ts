import path from 'path'

// FIXME Somehow TS complains about not finding '@typescript-eslint/utils'
import { ASTUtils, AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils'
import { ESLint, type Rule } from 'eslint'

const isJSXIdentifier = ASTUtils.isNodeOfType(AST_NODE_TYPES.JSXIdentifier)
const isJSXAttribute = ASTUtils.isNodeOfType<AST_NODE_TYPES.JSXAttribute>(
  AST_NODE_TYPES.JSXAttribute
)
const isLiteral = ASTUtils.isNodeOfType(AST_NODE_TYPES.Literal)

const PLUGIN_NAME = 'eslint-scan-icon-names'
const RULE_NAME = 'icon-name'

/**
 * Finds all `<Icon name="..." />` components and extacts `name` attribute from
 * source code tree.
 */
async function scanIconNames(projectDir: string) {
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
            node.openingElement.attributes
              .filter(isJSXAttribute)
              .filter((a) => a.name.name === 'name')
              .forEach((attribute) => {
                if (isLiteral(attribute.value) && typeof attribute.value.value === 'string') {
                  iconNames.add(attribute.value.value)
                }
              })
          }
          // All other components
          else {
            // iconName attribute
            node.openingElement.attributes
              .filter(isJSXAttribute)
              .filter((a) => a.name.name === 'iconName')
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
    meta: {
      messages: { default: '' },
      type: 'suggestion',
      schema: [],
    },
  }) as unknown as Rule.RuleModule // @typescript-eslint/utils RuleModule not compatible with the @types/eslint one?

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rules: { [RULE_NAME]: rule },
      },
    },
    useEslintrc: false,
  })

  // Scan files
  await eslint.lintFiles([path.join(projectDir, 'src', '**', '*.tsx')])

  return Array.from(iconNames)
}

export default scanIconNames
