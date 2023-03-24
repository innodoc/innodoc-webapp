import ContainerDirective from '#ui/components/content/markdown/directives/ContainerDirective'
import LeafDirective from '#ui/components/content/markdown/directives/LeafDirective'
import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

function DivNode({ children, node }: MarkdownComponentProps<'div'>) {
  if (node.properties?.type === 'containerDirective') {
    return <ContainerDirective node={node}>{children}</ContainerDirective>
  } else if (node.properties?.type === 'leafDirective') {
    return <LeafDirective node={node}>{children}</LeafDirective>
  }

  return <div>{children}</div>
}

export default DivNode
