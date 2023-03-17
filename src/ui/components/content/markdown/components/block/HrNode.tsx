import { Divider } from '@mui/material'

import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

function HrNode({ children }: MarkdownComponentProps<'hr'>) {
  return <Divider>{children}</Divider>
}

export default HrNode
