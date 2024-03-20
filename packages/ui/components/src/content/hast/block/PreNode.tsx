import { CodeBlock } from '#common/misc'
import type { HastComponentProps } from '#content/hast'

function PreNode({ children }: HastComponentProps<'pre'>) {
  // TODO: syntax highlighting
  return <CodeBlock>{children}</CodeBlock>
}

export default PreNode
