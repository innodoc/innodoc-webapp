import { Code } from '#components/common'
import type { HastComponentProps } from '#components/content/hast'

function CodeNode({ children }: HastComponentProps<'code'>) {
  return <Code>{children}</Code>
}

export default CodeNode
