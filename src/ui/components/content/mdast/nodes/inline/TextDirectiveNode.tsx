import type { TextDirective } from 'mdast-util-directive'

function TextDirectiveNode({ node }: TextDirectiveNodeProps) {
  // TODO
  return <>TextDirectiveNode</>
}

interface TextDirectiveNodeProps {
  node: TextDirective
}

export default TextDirectiveNode
