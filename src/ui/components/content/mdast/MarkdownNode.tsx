import type { Root } from 'mdast'

import ContentNode from './nodes/ContentNode'

/** Markdown document root node */
function MarkdownNode({ node }: RootProps) {
  return (
    <>
      {node.children.map((child, idx) => (
        <ContentNode node={child} key={idx.toString()} />
      ))}
    </>
  )
}

interface RootProps {
  node: Root
}

export default MarkdownNode
