import { styled, Typography } from '@mui/material'
import type { Variant } from '@mui/material/styles/createTypography'

import type { HastComponentProps } from '#components/content/hast'

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(3),
}))

function HeadingNode({ children, id, node: { tagName } }: HastComponentProps<'h1'>) {
  return (
    <StyledTypography id={id} variant={tagName as Variant}>
      {children}
    </StyledTypography>
  )
}

export default HeadingNode
