import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

import ContainerDirective from './ContainerDirective'
import LeafDirective from './LeafDirective'

function DivNode({ children, node }: MarkdownComponentProps<'div'>) {
  if (node.properties?.type === 'containerDirective') {
    return <ContainerDirective node={node}>{children}</ContainerDirective>
  } else if (node.properties?.type === 'leafDirective') {
    return <LeafDirective node={node}>{children}</LeafDirective>
  }

  return <div>{children}</div>
}

export default DivNode
