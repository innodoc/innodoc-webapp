import { styled, Typography } from '@mui/material'
import type { Variant } from '@mui/material/styles/createTypography'

import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(3),
}))

function HeadingNode({ children, node: { tagName } }: MarkdownComponentProps<'h1'>) {
  return <StyledTypography variant={tagName as Variant}>{children}</StyledTypography>
}

export default HeadingNode
