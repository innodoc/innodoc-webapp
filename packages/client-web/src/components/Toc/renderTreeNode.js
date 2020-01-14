import React from 'react'
import classNames from 'classnames'
import { Tree } from 'antd'

import { SectionLink } from '../content/links'
import ActiveSectionLabel from './ActiveSectionLabel'
import css from './style.sss'

const renderTreeNode = (section, currentSectionId) => {
  const { id: sectionId, children = [] } = section
  const active = sectionId === currentSectionId
  const sectionNode = active ? (
    <ActiveSectionLabel sectionId={sectionId} />
  ) : (
    <SectionLink contentId={sectionId} />
  )
  const childrenNodes = children.map((s) => renderTreeNode(s, currentSectionId))
  return (
    <Tree.TreeNode
      className={classNames({ [css.active]: active })}
      key={sectionId}
      title={sectionNode}
    >
      {childrenNodes}
    </Tree.TreeNode>
  )
}

export default renderTreeNode
