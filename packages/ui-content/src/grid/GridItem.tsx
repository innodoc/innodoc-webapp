import type { GridOffset, GridSize } from '@mui/material/Grid'
import type { ReactNode } from 'react'
import { styled } from '@mui/material'
import MuiGrid from '@mui/material/Grid'
import camelcaseKeys from 'camelcase-keys'
import { GRID_ITEM_PROPERTIES } from '@innodoc/content-parser/properties'
import type { NodeProps } from '#types'

const StyledGrid = styled(MuiGrid)({
  '& > :first-child': { marginTop: 0 },
  '& > :last-child': { marginBottom: 0 },
})

function parseValue(value: string): GridSize | GridOffset {
  return value === 'auto' ? 'auto' : Number.parseInt(value)
}

function nodeToGridProps(nodeProps: GridItemProps['nodeProps']) {
  const size: Record<string, GridSize | undefined> = {}
  const offset: Record<string, GridOffset | undefined> = {}

  for (const name of GRID_ITEM_PROPERTIES) {
    const propVal = nodeProps[name]
    if (!propVal) {
      continue
    }

    const camelName = camelcaseKeys({ [name]: true })[name]
    if (name.endsWith('-offset')) {
      offset[camelName] = parseValue(propVal) as GridOffset
    } else {
      size[camelName] = parseValue(propVal) as GridSize
    }
  }

  const result: Record<string, unknown> = {}
  if (Object.values(size).some(Boolean)) {
    result.size = size
  }
  if (Object.values(offset).some(Boolean)) {
    result.offset = offset
  }

  return result
}

function GridItem({ children, nodeProps }: GridItemProps) {
  return <StyledGrid {...nodeToGridProps(nodeProps)}>{children}</StyledGrid>
}

interface GridItemProps {
  children: ReactNode
  nodeProps: NodeProps<typeof GRID_ITEM_PROPERTIES>
}

export default GridItem
