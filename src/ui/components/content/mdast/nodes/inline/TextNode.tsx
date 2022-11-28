import type { Text } from 'mdast'

function TextNode({ node }: TextNodeProps) {
  return <>{node.value}</>
}

interface TextNodeProps {
  node: Text
}

export default TextNode
