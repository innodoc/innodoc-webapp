import { styled, Typography } from '@mui/material'

import type { HastComponentProps } from '#components/content/hast'

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
}))

function PNode({ children }: HastComponentProps<'p'>) {
  return (
    <StyledTypography paragraph variant="body1">
      {children}
    </StyledTypography>
  )
}

export default PNode
