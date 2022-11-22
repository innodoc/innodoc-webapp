import type { Text } from 'mdast'

function TextNode({ node }: TextNodeProps) {
  return <>{node.value}</>
}

type TextNodeProps = {
  node: Text
}

export default TextNode
