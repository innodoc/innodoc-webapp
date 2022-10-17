import { Typography } from '@mui/material'

import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Para({ content }: ContentComponentProps<'Para'>) {
  return (
    <Typography paragraph sx={{ my: 2 }} variant="body1">
      <ContentTree content={content} />
    </Typography>
  )
}

export default Para
