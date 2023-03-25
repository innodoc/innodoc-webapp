import { TableBody } from '@mui/material'

import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

function TBodyNode({ children }: MarkdownComponentProps<'tbody'>) {
  return <TableBody>{children}</TableBody>
}

export default TBodyNode
