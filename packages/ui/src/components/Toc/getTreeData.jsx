import SectionLink from '../content/links/SectionLink.js'

import ActiveSectionLabel from './ActiveSectionLabel.jsx'
import SectionTypeTag from './SectionTypeTag.jsx'
import css from './Toc.module.sss'

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
