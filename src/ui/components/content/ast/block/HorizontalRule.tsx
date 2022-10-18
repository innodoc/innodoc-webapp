import { Divider } from '@mui/material'

import type { ContentComponentProps } from '@/ui/components/content/ast/types'

function HorizontalRule({}: ContentComponentProps<'HorizontalRule'>) {
  return <Divider />
}

export default HorizontalRule
