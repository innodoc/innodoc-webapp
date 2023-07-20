import { CodeBlock } from '#components/common'
import type { HastComponentProps } from '#components/content/hast'

function PreNode({ children }: HastComponentProps<'pre'>) {
  // TODO: syntax highlighting
  return <CodeBlock>{children}</CodeBlock>
}

export default PreNode
