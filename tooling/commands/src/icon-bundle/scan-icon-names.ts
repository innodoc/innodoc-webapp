import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { AST_NODE_TYPES, parse, simpleTraverse } from '@typescript-eslint/typescript-estree'

async function findTsxFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await findTsxFiles(fullPath)))
    } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
      files.push(fullPath)
    }
  }
  return files
}

/** Finds all `<Icon name="..." />` components and extacts `name` attribute from source code tree. */
async function scanIconNames(paths: string[]): Promise<string[]> {
  const iconNames = new Set<string>()

  const allFiles: string[] = []
  for (const path of paths) {
    const tsxFiles = await findTsxFiles(path)
    allFiles.push(...tsxFiles)
  }

  for (const filePath of allFiles) {
    const code = await readFile(filePath, 'utf8')
    const ast = parse(code, { filePath })

    simpleTraverse(ast, {
      visitors: {
        [AST_NODE_TYPES.JSXElement]: (node) => {
          if (node.type === AST_NODE_TYPES.JSXElement) {
            // <Icon /> tags
            if (
              node.openingElement.selfClosing &&
              node.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier &&
              node.openingElement.name.name.endsWith('Icon')
            ) {
              // name attribute
              for (const attr of node.openingElement.attributes) {
                if (
                  attr.type === AST_NODE_TYPES.JSXAttribute &&
                  attr.name.name === 'name' &&
                  attr.value?.type === AST_NODE_TYPES.Literal &&
                  typeof attr.value.value === 'string'
                ) {
                  iconNames.add(attr.value.value)
                }
              }
            }

            // All other tags
            else {
              // iconName attribute
              for (const attr of node.openingElement.attributes) {
                if (
                  attr.type === AST_NODE_TYPES.JSXAttribute &&
                  attr.name.name === 'iconName' &&
                  attr.value?.type === AST_NODE_TYPES.Literal &&
                  typeof attr.value.value === 'string'
                ) {
                  iconNames.add(attr.value.value)
                }
              }
            }
          }
        },
      },
    })
  }

  return [...iconNames]
}

export default scanIconNames
