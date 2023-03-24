import { styled, Typography } from '@mui/material'

import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
}))

function PNode({ children }: MarkdownComponentProps<'p'>) {
  return (
    <StyledTypography paragraph variant="body1">
      {children}
    </StyledTypography>
  )
}

export default PNode
