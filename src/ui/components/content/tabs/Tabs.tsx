import { TabContext, TabList } from '@mui/lab'
import { Paper, styled, Tab } from '@mui/material'
import { type ReactNode, useState, type SyntheticEvent } from 'react'

import type { TABS_PROPERTIES } from './types'

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

function Tabs({ children, nodeProps: { labels: labelsString } }: TabsProps) {
  const labels = (labelsString ?? '').split(',')
  const [value, setValue] = useState('0')

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
        {children}
      </TabContext>
    </StyledPaper>
  )
}

interface TabsProps {
  children: ReactNode
  nodeProps: Partial<Record<(typeof TABS_PROPERTIES)[number], string>>
}

export default Tabs
