import { Code } from '@innodoc/components-common/misc'
import type { HastComponentProps } from '#hast'

function CodeNode({ children }: HastComponentProps<'code'>) {
  return <Code>{children}</Code>
}

export default CodeNode
