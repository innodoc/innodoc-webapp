import { Typography } from '@mui/material'

import type { ContentComponentProps } from '@/ui/components/content/ast/types'

function RawBlock({ content: [format, content] }: ContentComponentProps<'RawBlock'>) {
  return (
    <Typography
      gutterBottom
      variant="body1"
      sx={(theme) => ({ color: theme.vars.palette.error.main })}
    >
      {content} (Format: {format})
    </Typography>
  )
}

export default RawBlock
