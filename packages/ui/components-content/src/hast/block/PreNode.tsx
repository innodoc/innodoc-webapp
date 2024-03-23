import { CodeBlock } from '@innodoc/components-common/misc'
import type { HastComponentProps } from '#hast'

function PreNode({ children }: HastComponentProps<'pre'>) {
  // TODO: syntax highlighting
  return <CodeBlock>{children}</CodeBlock>
}

export default PreNode
