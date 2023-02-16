import { Typography } from '@mui/material'
import type { Paragraph } from 'mdast'

import PhrasingContentNode from '#ui/components/content/mdast/nodes/PhrasingContentNode'

function ParagraphNode({ node }: ParagraphNodeProps) {
  return (
    <Typography paragraph sx={{ my: 2 }} variant="body1">
      {node.children.map((child, idx) => (
        <PhrasingContentNode node={child} key={child?.data?.id ?? idx.toString()} />
      ))}
    </Typography>
  )
}

interface ParagraphNodeProps {
  node: Paragraph
}

export default ParagraphNode
