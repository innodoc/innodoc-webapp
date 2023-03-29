import { styled } from '@mui/material'
import MuiGrid from '@mui/material/Unstable_Grid2'
import camelcaseKeys from 'camelcase-keys'
import type { ComponentProps, ReactNode } from 'react'

import type { NodeProps } from '#ui/components/content/types'

const GRID_ITEM_PROPERTIES = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xs-offset',
  'sm-offset',
  'md-offset',
  'lg-offset',
  'xl-offset',
] as const

const StyledGrid = styled(MuiGrid)({
  '& > :first-child': { marginTop: 0 },
  '& > :last-child': { marginBottom: 0 },
})

function nodeToGridProps(nodeProps: GridItemProps['nodeProps']) {
  return camelcaseKeys(
    GRID_ITEM_PROPERTIES.reduce((acc, prop) => {
      const propVal = nodeProps[prop]
      if (propVal) {
        return {
          ...acc,
          [prop]: nodeProps[prop] === 'auto' ? propVal : parseInt(propVal),
        }
      }
      return acc
    }, {} as ComponentProps<typeof MuiGrid>)
  )
}

function GridItem({ children, nodeProps }: GridItemProps) {
  return <StyledGrid {...nodeToGridProps(nodeProps)}>{children}</StyledGrid>
}

interface GridItemProps {
  children: ReactNode
  nodeProps: NodeProps<typeof GRID_ITEM_PROPERTIES>
}

export { GRID_ITEM_PROPERTIES }
export default GridItem
