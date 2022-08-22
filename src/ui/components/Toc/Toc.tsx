import { TreeView } from '@mui/lab'
import { styled } from '@mui/material'
import { memo, useState } from 'react'

import { selectToc } from '@/store/selectors/content/section'
import type { TranslatedSection } from '@/types/api'
import Icon from '@/ui/components/common/Icon'
import { useSelector } from '@/ui/hooks/store'

import TocTreeItem from './TocTreeItem'

const getNodeId = (idPrefix: string, sectionId: string) =>
  idPrefix === '' ? sectionId : `${idPrefix}/${sectionId}`

const renderItems = (sections: TranslatedSection[], idPrefix = '') =>
  sections.map((section) => {
    const nodeId = getNodeId(idPrefix, section.id)
    return (
      <TocTreeItem key={section.id} nodeId={nodeId} section={section}>
        {section.children !== undefined ? renderItems(section.children, nodeId) : null}
      </TocTreeItem>
    )
  })

const getAllNodeIds = (sections: TranslatedSection[], idPrefix = ''): string[] =>
  sections.reduce<string[]>((acc, section) => {
    const nodeId = getNodeId(idPrefix, section.id)
    return [
      ...acc,
      nodeId,
      ...(section.children !== undefined ? getAllNodeIds(section.children, nodeId) : []),
    ]
  }, [])

// Remove pointer cursor and background hover
const StyledTreeView = styled(TreeView)({
  '& .MuiTreeItem-content': {
    cursor: 'inherit',
    paddingLeft: 0,
    paddingRight: 0,
  },
  '& .MuiTreeItem-content:hover': {
    backgroundColor: 'inherit',
  },
  '& .MuiTreeItem-content.Mui-focused': {
    backgroundColor: 'inherit',
  },
})

function Toc({ renderExpanded = false }: TocProps) {
  const toc = useSelector(selectToc)
  const [expanded, setExpanded] = useState<string[]>(renderExpanded ? getAllNodeIds(toc || []) : [])

  if (toc === undefined) return null

  return (
    <>
      <StyledTreeView
        defaultCollapseIcon={<Icon name="mdi:chevron-down" />}
        defaultExpandIcon={<Icon name="mdi:chevron-right" />}
        disableSelection
        expanded={expanded}
        id="table-of-contents"
        selected={[]}
      >
        {renderItems(toc)}
      </StyledTreeView>
    </>
  )
}

type TocProps = {
  /** Render without expanding/collapsing functionality */
  renderExpanded?: boolean
}

export default memo(Toc)
