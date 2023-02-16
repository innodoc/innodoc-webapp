import { Typography } from '@mui/material'
import type { Heading } from 'mdast'
import { Trans } from 'react-i18next'

import InlineError from '#ui/components/common/error/InlineError'
import PhrasingContentNode from '#ui/components/content/mdast/nodes/PhrasingContentNode'

function HeadingNode({ node: { children, depth } }: HeadingNodeProps) {
  if (depth < 1 || depth > 6) {
    return (
      <InlineError>
        <Trans i18nKey="error.invalidHeaderDepth">
          Header depth must be in range from 1 to 6, got {{ depth }}
        </Trans>
      </InlineError>
    )
  }

  const childrenNodes = children.map((child, idx) => (
    <PhrasingContentNode key={child?.data?.id ?? idx.toString()} node={child} />
  ))

  return (
    <Typography sx={{ mb: 2, mt: 3 }} variant={`h${depth}`}>
      {childrenNodes}
    </Typography>
  )
}

interface HeadingNodeProps {
  node: Heading
}

export default HeadingNode
