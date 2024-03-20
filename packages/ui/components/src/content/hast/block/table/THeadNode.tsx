import { TableHead } from '@mui/material'

import type { HastComponentProps } from '#content/hast'

function THeadNode({ children }: HastComponentProps<'thead'>) {
  return <TableHead>{children}</TableHead>
}

export default THeadNode
