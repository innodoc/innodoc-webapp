import { TabPanel } from '@mui/lab'
import { styled } from '@mui/material'
import { type ReactNode } from 'react'

import type { TAB_ITEM_PROPERTIES } from './types'

const StyleTabPanel = styled(TabPanel)({ padding: 0 })

function TabItem({ children, nodeProps }: TabItemProps) {
  return <StyleTabPanel value={nodeProps.index ?? '0'}>{children}</StyleTabPanel>
}

interface TabItemProps {
  children: ReactNode
  nodeProps: Partial<Record<(typeof TAB_ITEM_PROPERTIES)[number], string>>
}

export default TabItem
