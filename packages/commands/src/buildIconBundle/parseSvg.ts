import { isElement } from 'hast-util-is-element'
import rehypeParse from 'rehype-parse'
import { unified } from 'unified'
import { removePosition } from 'unist-util-remove-position'

const processor = unified().use(rehypeParse, { fragment: true, space: 'svg' })

/** Parse SVG image to hast */
function parseSvg(svgCode: string) {
  const rootNode = removePosition(processor.parse(svgCode))

  // Find path data
  for (const child of rootNode.children) {
    if (isElement(child, 'svg')) {
      const path = child.children[0]
      if (isElement(path, 'path') && typeof path.properties?.d === 'string') {
        return path.properties.d
      }
    }
  }

  throw new Error('Unable to find path d property.')
}

export default parseSvg
