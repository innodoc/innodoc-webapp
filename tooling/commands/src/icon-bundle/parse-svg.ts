import { isElement } from 'hast-util-is-element'
import rehypeParse from 'rehype-parse'
import { unified } from 'unified'
import { removePosition } from 'unist-util-remove-position'

const processor = unified().use(rehypeParse, { fragment: true, space: 'svg' })

/**
 * Parse SVG icon and extract path data as a single `d` string.
 *
 * The `d` attributes of all `<path>` children are concatenated (each starts a new
 * subpath, so the result is valid path data). Elements that cannot be expressed
 * as path data (e.g. `<circle>`) throw, since the icon bundle's `{ name: d }`
 * shape cannot represent them.
 */
function parseSvg(svgCode: string) {
  const rootNode = processor.parse(svgCode)
  removePosition(rootNode, { force: true })

  for (const child of rootNode.children) {
    if (!isElement(child, 'svg')) {
      continue
    }

    const pathData: string[] = []
    for (const node of child.children) {
      if (!isElement(node)) {
        // Whitespace text node
        continue
      }
      if (isElement(node, 'path')) {
        const d = node.properties.d
        if (typeof d !== 'string') {
          throw new TypeError('Found <path> without `d` property in icon body.')
        }
        pathData.push(d)
        continue
      }
      throw new Error(
        `Element <${node.tagName}> cannot be expressed as path data. Icon bodies must contain only <path> elements.`,
      )
    }

    if (pathData.length === 0) {
      throw new Error('No path data found in icon body.')
    }

    return pathData.join('')
  }

  throw new Error('No <svg> element found in icon body.')
}

export default parseSvg
