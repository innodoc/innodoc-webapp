import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

import TextDirective from './TextDirective'

function SpanNode({ children, node, ...other }: MarkdownComponentProps<'span'>) {
  if (node.properties?.type === 'textDirective') {
    return <TextDirective node={node}>{children}</TextDirective>
  }

  // Pass props for KaTeX nodes
  return <span {...other}>{children}</span>
}

export default SpanNode
