import { Typography } from '@mui/material'
import type { Variant } from '@mui/material/styles/createTypography'
import clsx from 'clsx'

import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Header({ content: [level, [id, classes], content] }: ContentComponentProps<'Header'>) {
  if (level < 1 || level > 6) {
    throw new Error(`Header level must be in range from 1 to 6, got ${level}.`)
  }

  return (
    <Typography className={clsx(classes)} gutterBottom id={id} variant={`h${level}` as Variant}>
      <ContentTree content={content} />
    </Typography>
  )
}

export default Header
