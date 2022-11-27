import { TreeView } from '@mui/lab'
import { styled } from '@mui/material'
import { type SyntheticEvent, useState, useMemo } from 'react'

import useSelectSectionChildren from '#store/hooks/useSelectSectionChildren'
import { selectCurrentSectionPath } from '#store/slices/uiSlice'
import type { ApiSection } from '#types/entities/section'
import Icon from '#ui/components/common/Icon'
import { useSelector } from '#ui/hooks/store'

import TocTreeItem from './TocTreeItem'

/** Return array of initially expanded section paths/node IDs (all parents) */
function getInitialExpanded(sectionPath?: ApiSection['path']) {
  if (sectionPath === undefined) return []
  const parts = sectionPath.split('/')
  return parts.slice(0, parts.length - 1).map((_, idx) => {
    return parts.slice(0, idx + 1).join('/')
  })
}

// Remove pointer cursor and background hover
const StyledTreeView = styled(TreeView)(({ theme }) => ({
  width: '100%',
  '& .MuiTreeItem-group': {
    marginInlineStart: 0,
  },
  '& .MuiTreeItem-content': {
    padding: theme.spacing(1, 2),
  },
  '& .MuiTreeItem-iconContainer': {
    // TODO: fix css order
    marginRight: theme.spacing(2),
  },
}))

function Toc() {
  const { sections } = useSelectSectionChildren(null)
  const currentSectionPath = useSelector(selectCurrentSectionPath)

  // Expand all sections up to current
  const initialExpanded = useMemo(
    () => getInitialExpanded(currentSectionPath),
    [currentSectionPath]
  )
  const [expanded, setExpanded] = useState<string[]>(initialExpanded)

  // Called when tree item expand button is clicked
  const onNodeToggle = (ev: SyntheticEvent, nodeIds: string[]) => {
    setExpanded([...nodeIds])
  }

  const children = sections.map((s) => <TocTreeItem key={s.id} nodeId={s.path} section={s} />)

  return (
    <>
      <StyledTreeView
        defaultCollapseIcon={<Icon name="mdi:chevron-down" />}
        defaultExpandIcon={<Icon name="mdi:chevron-right" />}
        disableSelection
        expanded={expanded}
        onNodeToggle={onNodeToggle}
        selected={currentSectionPath !== undefined ? [currentSectionPath] : []}
      >
        {children}
      </StyledTreeView>
    </>
  )
}

export default Toc
