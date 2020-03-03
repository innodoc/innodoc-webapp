import React from 'react'

import { SectionLink } from '../content/links'
import ActiveSectionLabel from './ActiveSectionLabel'

const getTreeNode = (section, currentSectionId) => {
  const { id: sectionId, children = [] } = section
  const active = sectionId === currentSectionId
  const title = active ? (
    <ActiveSectionLabel sectionId={sectionId} />
  ) : (
    <SectionLink contentId={sectionId} />
  )
  return {
    children: children.map((child) => getTreeNode(child, currentSectionId)),
    key: sectionId,
    title,
  }
}

export default (tocData, currentSectionId) =>
  tocData.map((section) => getTreeNode(section, currentSectionId))
