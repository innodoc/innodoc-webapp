import MuiGrid from '@mui/material/Unstable_Grid2'
import camelcaseKeys from 'camelcase-keys'
import type { ComponentProps, ReactNode } from 'react'

import { GRID_PROPERTIES } from './types'

function nodeToGridProps(nodeProps: GridItemProps['nodeProps']) {
  return camelcaseKeys(
    GRID_PROPERTIES.reduce((acc, prop) => {
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
  return <MuiGrid {...nodeToGridProps(nodeProps)}>{children}</MuiGrid>
}

interface GridItemProps {
  children: ReactNode
  nodeProps: Partial<Record<(typeof GRID_PROPERTIES)[number], string>>
}

export default GridItem
