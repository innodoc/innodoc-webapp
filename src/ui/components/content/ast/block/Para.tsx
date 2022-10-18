import { Typography } from '@mui/material'

import ContentTree from '@/ui/components/content/ast/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/ast/types'

function Para({ content }: ContentComponentProps<'Para'>) {
  return (
    <Typography paragraph sx={{ my: 2 }} variant="body1">
      <ContentTree content={content} />
    </Typography>
  )
}

export default Para
