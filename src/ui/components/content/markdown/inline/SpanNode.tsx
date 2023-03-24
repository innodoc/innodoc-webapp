import TextDirective from '#ui/components/content/markdown/directives/TextDirective'
import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

function SpanNode({ children, node, ...other }: MarkdownComponentProps<'span'>) {
  if (node.properties?.type === 'textDirective') {
    return <TextDirective node={node}>{children}</TextDirective>
  }

  // Pass props for KaTeX nodes
  return <span {...other}>{children}</span>
}

export default SpanNode
