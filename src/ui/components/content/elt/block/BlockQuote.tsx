import { styled } from '@mui/material'

import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

const StyledBlockquote = styled('blockquote')(({ theme }) => ({
  color: theme.vars.palette.text.secondary,
  borderLeftColor: theme.vars.palette.secondary.main,
  borderLeftStyle: 'solid',
  borderLeftWidth: theme.spacing(0.5),
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
