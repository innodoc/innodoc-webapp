import { Code } from '#common/misc'
import type { HastComponentProps } from '#content/hast'

function CodeNode({ children }: HastComponentProps<'code'>) {
  return <Code>{children}</Code>
}

export default CodeNode
