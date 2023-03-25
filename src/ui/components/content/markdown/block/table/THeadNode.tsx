import { TableHead } from '@mui/material'

import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

function THeadNode({ children }: MarkdownComponentProps<'thead'>) {
  return <TableHead>{children}</TableHead>
}

export default THeadNode
