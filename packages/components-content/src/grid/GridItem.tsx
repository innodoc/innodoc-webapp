import { styled } from '@mui/material'
import MuiGrid from '@mui/material/Unstable_Grid2'
import camelcaseKeys from 'camelcase-keys'
import type { ReactNode } from 'react'

import { GRID_ITEM_PROPERTIES } from '@innodoc/markdown/properties'

import type { NodeProps } from '#types'

const StyledGrid = styled(MuiGrid)({
  '& > :first-child': { marginTop: 0 },
  '& > :last-child': { marginBottom: 0 },
})

function nodeToGridProps(nodeProps: GridItemProps['nodeProps']) {
  const props: Record<string, number | string> = {}

  for (const name of GRID_ITEM_PROPERTIES) {
    const propVal = nodeProps[name]
    if (propVal) {
      props[name] = propVal === 'auto' ? propVal : Number.parseInt(propVal)
    }
  }

  return camelcaseKeys(props)
}

function GridItem({ children, nodeProps }: GridItemProps) {
  return <StyledGrid {...nodeToGridProps(nodeProps)}>{children}</StyledGrid>
}

interface GridItemProps {
  children: ReactNode
  nodeProps: NodeProps<typeof GRID_ITEM_PROPERTIES>
}

export default GridItem
