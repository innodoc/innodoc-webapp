import { styled } from '@mui/material'
import type { InlineCode } from 'mdast'

const StyledCode = styled('code')(({ theme }) => ({
  backgroundColor: theme.vars.palette.Code.bg,
  borderColor: theme.vars.palette.Code.border,
  borderRadius: theme.shape.borderRadius,
  borderStyle: 'solid',
  borderWidth: '1px',
  color: theme.vars.palette.Code.color,
  fontFamily: theme.typography.code.fontFamily,
  margin: theme.typography.code.margin,
  padding: theme.typography.code.padding,
}))

function InlineCodeNode({ node }: InlineCodeNodeProps) {
  return <StyledCode>{node.value}</StyledCode>
}

interface InlineCodeNodeProps {
  node: InlineCode
}

export default InlineCodeNode
