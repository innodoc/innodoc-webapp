import { styled } from '@mui/material'

import type { HastComponentProps } from '#components/content/hast'

const StyledUl = styled('ol')(({ theme }) => ({ paddingLeft: theme.spacing(4) }))

function OlNode({ children }: HastComponentProps<'ol'>) {
  return <StyledUl>{children}</StyledUl>
}

export default OlNode
