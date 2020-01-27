import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Tree } from 'antd'

import courseSelectors from '@innodoc/client-store/src/selectors/course'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import renderTreeNode from './renderTreeNode'
import useAutoExpand from './useAutoExpand'
import css from './style.sss'

const Toc = ({ expandAll }) => {
  const course = useSelector(courseSelectors.getCurrentCourse)
  const toc = useSelector(sectionSelectors.getToc)
  const currentSectionId = course ? course.currentSectionId : undefined
  const [expandedKeys, setExpandedKeys] = useState(
    currentSectionId ? [currentSectionId] : []
  )
  useAutoExpand(currentSectionId, expandAll, expandedKeys, setExpandedKeys)

  const treeNodes = toc.map((s) => renderTreeNode(s, currentSectionId))
  const tree = expandAll ? (
    <Tree className={css.disableExpand} defaultExpandAll>
      {treeNodes}
    </Tree>
  ) : (
    <Tree
      expandedKeys={expandedKeys}
      onExpand={(keys) => setExpandedKeys(keys)}
    >
      {treeNodes}
    </Tree>
  )

  return <div className={css.tocWrapper}>{tree}</div>
}

Toc.defaultProps = { expandAll: false }
Toc.propTypes = { expandAll: PropTypes.bool }

export default Toc
