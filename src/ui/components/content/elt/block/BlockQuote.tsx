import { styled } from '@mui/material'

import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

const StyledBlockquote = styled('blockquote')(({ theme }) => ({
  borderLeftColor: theme.vars.palette.primary.main,
  borderLeftStyle: 'solid',
  borderLeftWidth: theme.spacing(0.5),
  color: theme.vars.palette.text.secondary,
  margin: theme.spacing(2, 0),
  padding: theme.spacing(0, 1),
}))

function BlockQuote({ content }: ContentComponentProps<'BlockQuote'>) {
  return (
    <StyledBlockquote>
      <ContentTree content={content} />
    </StyledBlockquote>
  )
}

export default BlockQuote
