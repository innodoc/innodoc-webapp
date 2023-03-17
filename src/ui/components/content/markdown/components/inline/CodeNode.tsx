import Code from '#ui/components/common/Code'
import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

function CodeNode({ children }: MarkdownComponentProps<'code'>) {
  return <Code>{children}</Code>
}

export default CodeNode
