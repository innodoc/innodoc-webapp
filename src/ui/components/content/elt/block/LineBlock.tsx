import { Box, Typography } from '@mui/material'

import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function LineBlock({ content }: ContentComponentProps<'LineBlock'>) {
  return (
    <Box>
      {content.map((line, idx) => (
        <Typography key={idx} variant="body1">
          <ContentTree content={line} />
        </Typography>
      ))}
    </Box>
  )
}

export default LineBlock
