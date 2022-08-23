import { TreeView } from '@mui/lab'
import { styled } from '@mui/material'
import { type SyntheticEvent, useState } from 'react'

import { selectToc } from '@/store/selectors/content/section'
import { selectUrlWithoutLocale } from '@/store/selectors/ui'
import type { Section } from '@/types/api'
import Icon from '@/ui/components/common/Icon'
import { useSelector } from '@/ui/hooks/store'

import TocTreeItem from './TocTreeItem'

const getNodeId = (section: Section) => [...section.parents, section.id].join('/')

const renderItems = (sections: Section[]) =>
  sections.map((section) => (
    <TocTreeItem key={section.id} nodeId={getNodeId(section)} section={section}>
      {section.children !== undefined ? renderItems(section.children) : null}
    </TocTreeItem>
  ))

// Remove pointer cursor and background hover
const StyledTreeView = styled(TreeView)(({ theme }) => ({
  width: '100%',
  '& .MuiTreeItem-group': {
    marginInlineStart: 0,
  },
  '& .MuiTreeItem-content': {
    padding: theme.spacing(1, 2),
  },
}))

function Toc() {
  const toc = useSelector(selectToc)
  const urlWithoutLocale = useSelector(selectUrlWithoutLocale)
  const [expanded, setExpanded] = useState<string[]>([])

  const selected = urlWithoutLocale?.startsWith(`/${import.meta.env.INNODOC_SECTION_PATH_PREFIX}/`)
    ? [urlWithoutLocale.substring(import.meta.env.INNODOC_SECTION_PATH_PREFIX.length + 2)]
    : []

  if (toc === undefined) return null

  const onNodeToggle = (ev: SyntheticEvent, nodeIds: string[]) => {
    setExpanded([...nodeIds])
  }

  return (
    <>
      <StyledTreeView
        defaultCollapseIcon={<Icon name="mdi:chevron-down" />}
        defaultExpandIcon={<Icon name="mdi:chevron-right" />}
        disableSelection
        expanded={expanded}
        onNodeToggle={onNodeToggle}
        selected={selected}
      >
        {renderItems(toc)}
      </StyledTreeView>
    </>
  )
}

export default Toc
