import type { TypographyVariant } from '@mui/material/styles'
import { styled, Typography } from '@mui/material'
import type { HastComponentProps } from '#hast'

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(3),
}))

function HeadingNode({ children, id, node: { tagName } }: HastComponentProps<'h1'>) {
  return (
    <StyledTypography id={id} variant={tagName as TypographyVariant}>
      {children}
    </StyledTypography>
  )
}

export default HeadingNode
