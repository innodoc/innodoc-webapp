import { Typography } from '@mui/material'
import type { Variant } from '@mui/material/styles/createTypography'
import clsx from 'clsx'

import InlineError from '@/ui/components/common/InlineError'
import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

function Header({ content: [level, [id, classes], content] }: ContentComponentProps<'Header'>) {
  if (level < 1 || level > 6) {
    return <InlineError>Header level must be in range from 1 to 6, got {level}!</InlineError>
  }

  return (
    <Typography
      className={clsx(classes)}
      id={id}
      sx={{ mb: 2, mt: 3 }}
      variant={`h${level}` as Variant}
    >
      <ContentTree content={content} />
    </Typography>
  )
}

export default Header
