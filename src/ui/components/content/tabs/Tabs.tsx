import { TabContext, TabList } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import { type ReactNode, useState, type SyntheticEvent } from 'react'

import type { TABS_PROPERTIES } from './types'

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
    <Box sx={{ my: 2, typography: 'body1', width: '100%' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>{tabs}</TabList>
        </Box>
        {children}
      </TabContext>
    </Box>
  )
}

interface TabsProps {
  children: ReactNode
  nodeProps: Partial<Record<(typeof TABS_PROPERTIES)[number], string>>
}

export default Tabs
