import { TreeView } from '@mui/lab'
import { styled } from '@mui/material'
import { type SyntheticEvent, useState, useEffect, useRef } from 'react'

import type { RootState } from '#store/makeStore'
import { selectSectionByPath, selectSectionPath, selectToc } from '#store/selectors/content/section'
import type { SectionWithChildren } from '#types/api'
import Icon from '#ui/components/common/Icon'
import { useSelector } from '#ui/hooks/store'
import { getSectionPath } from '#utils/content'

import TocTreeItem from './TocTreeItem'

/** Return sections parent nodeIds */
const getExpanded = (
  sectionPath: string | undefined,
  toc: SectionWithChildren[] | undefined
): string[] => {
  if (sectionPath === undefined || toc === undefined) return []
  const expanded: string[] = []
  const parts = sectionPath.split('/')
  let sections = toc
  while (parts.length > 0) {
    const sectionId = parts.shift()
    const section = sections.find((s) => s.id === sectionId)
    if (section === undefined) return []
    if (section.children !== undefined && section.children.length > 0) {
      expanded.push([...section.parents, section.id].join('/'))
      sections = section.children
    }
  }
  return expanded
}

const renderItems = (sections: SectionWithChildren[]) =>
  sections.map((section) => (
    <TocTreeItem key={section.id} nodeId={getSectionPath(section)} section={section}>
      {Array.isArray(section.children) ? renderItems(section.children) : null}
    </TocTreeItem>
  ))

/** Remove pointer cursor and background hover */
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
  const toc = useSelector(selectToc)
  const currentSectionPath = useSelector(selectSectionPath)

  const [expanded, setExpanded] = useState<string[]>(getExpanded(currentSectionPath, toc))

  const prevSectionPath = useRef<string | null>(null)

  const selectSection = (state: RootState) => selectSectionByPath(state, currentSectionPath)
  const section = useSelector(selectSection)

  // Expand current section
  useEffect(() => {
    if (currentSectionPath !== undefined) {
      if (
        !expanded.includes(currentSectionPath) &&
        section !== undefined &&
        // Ignore leaf sections
        section.childrenCount > 0 &&
        // Expand only if section changed, otherwise it would be impossible to
        // close current subtree.
        currentSectionPath !== prevSectionPath.current
      ) {
        setExpanded((prev) => [...prev, currentSectionPath])
      }

      prevSectionPath.current = currentSectionPath
    }
  }, [currentSectionPath, expanded, section])

  if (toc === undefined) return null

  // Called when tree item expand button is clicked
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
        selected={currentSectionPath !== undefined ? [currentSectionPath] : []}
      >
        {renderItems(toc)}
      </StyledTreeView>
    </>
  )
}

export default Toc
