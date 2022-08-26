import { Typography } from '@mui/material'

import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function RawInline({ content: [format, content] }: ContentComponentProps<'RawInline'>) {
  return (
    <Typography
      component="span"
      sx={(theme) => ({ color: theme.vars.palette.error.main })}
      variant="body1"
    >
      {content} (Format: {format})
    </Typography>
  )
}

export default RawInline
