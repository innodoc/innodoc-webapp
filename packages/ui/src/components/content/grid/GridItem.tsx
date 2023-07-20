import { styled } from '@mui/material'
import MuiGrid from '@mui/material/Unstable_Grid2'
import camelcaseKeys from 'camelcase-keys'
import type { ComponentProps, ReactNode } from 'react'

import { GRID_ITEM_PROPERTIES } from '@innodoc/markdown/properties'

import type { NodeProps } from '#components/content/types'

const StyledGrid = styled(MuiGrid)({
  '& > :first-child': { marginTop: 0 },
  '& > :last-child': { marginBottom: 0 },
})

function nodeToGridProps(nodeProps: GridItemProps['nodeProps']) {
  return camelcaseKeys(
    GRID_ITEM_PROPERTIES.reduce(
      (acc, prop) => {
        const propVal = nodeProps[prop]
        if (propVal) {
          return {
            ...acc,
            [prop]: nodeProps[prop] === 'auto' ? propVal : parseInt(propVal),
          }
        }
        return acc
      },
      {} as ComponentProps<typeof MuiGrid>
    )
  )
}

function GridItem({ children, nodeProps }: GridItemProps) {
  return <StyledGrid {...nodeToGridProps(nodeProps)}>{children}</StyledGrid>
}

interface GridItemProps {
  children: ReactNode
  nodeProps: NodeProps<typeof GRID_ITEM_PROPERTIES>
}

export default GridItem
