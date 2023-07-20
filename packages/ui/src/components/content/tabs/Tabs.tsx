import { TabContext, TabList } from '@mui/lab'
import { Paper, styled, Tab } from '@mui/material'
import { type ReactNode, useState, type SyntheticEvent, useRef, useEffect } from 'react'

import type { TABS_PROPERTIES } from '@innodoc/markdown/properties'

import type { NodeProps } from '#components/content/types'

const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  paddingBottom: '0.015px',
  width: '100%',
}))

const StyledTabList = styled(TabList)(({ theme }) => ({
  borderBottomColor: theme.vars.palette.divider,
  borderBottomStyle: 'solid',
  borderBottomWidth: '1px',
}))

const StyledDiv = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  transition: theme.transitions.create('height'),
}))

function Tabs({ children, nodeProps: { labels: labelsProp } }: TabsProps) {
  const labels =
    Array.isArray(labelsProp) && labelsProp.every((l) => typeof l === 'string') ? labelsProp : []
  const [value, setValue] = useState('0')

  const panelWrapper = useRef<HTMLDivElement>(null)
  const [heights, setHeights] = useState<(number | null)[]>(labels.map(() => null))
  const panelIdx = parseInt(value)
  const height = heights[panelIdx]

  useEffect(() => {
    if (panelWrapper.current) {
      const children = Array.from(panelWrapper.current.children)
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const idx = children.indexOf(entry.target)
          if (idx >= 0 && idx < labels.length) {
            setHeights((prevHeights) => {
              const newHeights = [...prevHeights]
              newHeights[idx] = entry.borderBoxSize[0].blockSize
              return newHeights
            })
          }
        }
      })

      for (const panel of panelWrapper.current.children) {
        observer.observe(panel)
      }

      return () => {
        observer.disconnect()
      }
    }
  }, [labels.length])

  if (labels.length < 1) {
    return null
  }

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const tabs = labels.map((label, idx) => <Tab label={label} key={label} value={idx.toString()} />)

  return (
    <StyledPaper>
      <TabContext value={value}>
        <StyledTabList onChange={handleChange}>{tabs}</StyledTabList>
        <StyledDiv ref={panelWrapper} style={{ height: height === null ? 'auto' : `${height}px` }}>
          {children}
        </StyledDiv>
      </TabContext>
    </StyledPaper>
  )
}

interface TabsProps {
  children: ReactNode
  nodeProps: NodeProps<typeof TABS_PROPERTIES>
}

export default Tabs
