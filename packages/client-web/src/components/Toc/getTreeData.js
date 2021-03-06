import React from 'react'

import SectionTypeTag from '../SectionTypeTag'
import { SectionLink } from '../content/links'
import ActiveSectionLabel from './ActiveSectionLabel'
import css from './style.sss'

const getTreeNode = (section, currentSectionId, t) => {
  const { id: sectionId, children = [] } = section
  const active = sectionId === currentSectionId

  let title = active ? (
    <ActiveSectionLabel sectionId={sectionId} />
  ) : (
    <SectionLink contentId={sectionId} preferShortTitle />
  )

  if (['exercises', 'test'].includes(section.type)) {
    title = (
      <>
        {title}
        <SectionTypeTag className={css.sectionTag} type={section.type} />
      </>
    )
  }

  return {
    children: children.map((child) => getTreeNode(child, currentSectionId, t)),
    key: sectionId,
    title,
  }
}

const getTreeData = (tocData, currentSectionId, t) =>
  tocData.map((section) => getTreeNode(section, currentSectionId, t))

export default getTreeData
