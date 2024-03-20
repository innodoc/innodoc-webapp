import { TableBody } from '@mui/material'

import type { HastComponentProps } from '#content/hast'

function TBodyNode({ children }: HastComponentProps<'tbody'>) {
  return <TableBody>{children}</TableBody>
}

export default TBodyNode
