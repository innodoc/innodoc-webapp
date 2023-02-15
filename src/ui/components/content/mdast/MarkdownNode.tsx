import type { MarkdownDoc } from '#types/entities/markdown'

import { IndexProvider } from './IndexContext'
import ContentNode from './nodes/ContentNode'
import { CardTitleProvider } from './useCardTitle'

/** Markdown document root node */
function MarkdownNode({ content: { root, indices } }: RootProps) {
  const children = root.children.map((child, idx) => (
    <ContentNode node={child} key={child?.data?.uuid ?? idx.toString()} />
  ))

  return (
    <CardTitleProvider>
      <IndexProvider indices={indices}>{children}</IndexProvider>
    </CardTitleProvider>
  )
}

interface RootProps {
  content: MarkdownDoc
}

export default MarkdownNode
