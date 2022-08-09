import { Typography } from '@mui/material'

import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function RawBlock({ content: [format, content] }: ContentComponentProps<'RawBlock'>) {
  return (
    <Typography gutterBottom variant="body1" sx={{ color: 'error.main' }}>
      {content} (Format: {format})
    </Typography>
  )
}

export default RawBlock
