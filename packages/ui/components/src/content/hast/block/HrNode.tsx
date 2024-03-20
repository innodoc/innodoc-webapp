import { Divider } from '@mui/material'

import type { HastComponentProps } from '#content/hast'

function HrNode({ children }: HastComponentProps<'hr'>) {
  return <Divider>{children}</Divider>
}

export default HrNode
