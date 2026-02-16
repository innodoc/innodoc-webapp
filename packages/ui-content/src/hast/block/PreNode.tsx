import { CodeBlock } from '@innodoc/ui-design-system/misc'
import type { HastComponentProps } from '#hast'

function PreNode({ children }: HastComponentProps<'pre'>) {
  // TODO: syntax highlighting
  return <CodeBlock>{children}</CodeBlock>
}

export default PreNode
