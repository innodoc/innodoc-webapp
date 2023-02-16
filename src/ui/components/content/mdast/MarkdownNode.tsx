import { IndexProvider } from './IndexContext'
import ContentNode from './nodes/ContentNode'
import { CardTitleProvider } from './useCardTitle'
import useMarkdownParser from './useMarkdownParser'

/** Markdown document root node */
function MarkdownNode({ content }: RootProps) {
  const { root, indices } = useMarkdownParser(content)

  const children = root.children.map((child, idx) => (
    <ContentNode node={child} key={child?.data?.id ?? idx.toString()} />
  ))

  return (
    <CardTitleProvider>
      <IndexProvider indices={indices}>{children}</IndexProvider>
    </CardTitleProvider>
  )
}

interface RootProps {
  content: string
}

export default MarkdownNode
