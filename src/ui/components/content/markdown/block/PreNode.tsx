import CodeBlock from '#ui/components/common/CodeBlock'
import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

function PreNode({ children }: MarkdownComponentProps<'pre'>) {
  // TODO: syntax highlighting
  return <CodeBlock>{children}</CodeBlock>
}

export default PreNode
