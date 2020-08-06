import React from 'react'
import { AuditOutlined, FormOutlined } from '@ant-design/icons'

import { SectionLink } from '../content/links'
import ActiveSectionLabel from './ActiveSectionLabel'
import css from './style.sss'

const getTreeNode = (section, currentSectionId, t) => {
  const { id: sectionId, children = [] } = section
  const active = sectionId === currentSectionId

  let title = active ? (
    <ActiveSectionLabel sectionId={sectionId} />
  ) : (
    <SectionLink contentId={sectionId} />
  )

  if (['exercises', 'test'].includes(section.type)) {
    const Icon = section.type === 'exercises' ? FormOutlined : AuditOutlined
    const icon = (
      <Icon
        className={css.sectionIcon}
        title={t(`common.sectionTypes.${section.type}`)}
      />
    )
    title = (
      <>
        {title}
        {icon}
      </>
    )
  }

  return {
    children: children.map((child) => getTreeNode(child, currentSectionId, t)),
    key: sectionId,
    title,
  }
}

export default (tocData, currentSectionId, t) =>
  tocData.map((section) => getTreeNode(section, currentSectionId, t))
