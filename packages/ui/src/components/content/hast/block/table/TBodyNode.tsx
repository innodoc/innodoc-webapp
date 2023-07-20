import { TableBody } from '@mui/material'

import type { HastComponentProps } from '#components/content/hast'

function TBodyNode({ children }: HastComponentProps<'tbody'>) {
  return <TableBody>{children}</TableBody>
}

export default TBodyNode
