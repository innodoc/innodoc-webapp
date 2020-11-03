import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Tree } from 'antd'

import { useTranslation } from '@innodoc/common/src/i18n'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import getTreeData from './getTreeData'
import useAutoExpand from './useAutoExpand'
import css from './style.sss'

const Toc = ({ expandAll }) => {
  const { t } = useTranslation()
  const course = useSelector(courseSelectors.getCurrentCourse)
  const tocData = useSelector(sectionSelectors.getToc)
  const currentSectionId = course ? course.currentSectionId : undefined
  const [expandedKeys, setExpandedKeys] = useState(
    new Set(currentSectionId ? [currentSectionId] : null)
  )
  const treeData = getTreeData(tocData, currentSectionId, t)
  useAutoExpand(currentSectionId, expandAll, expandedKeys, setExpandedKeys)

  const tree = expandAll ? (
    <Tree className={css.disableExpand} defaultExpandAll selectable={false} treeData={treeData} />
  ) : (
    <Tree
      expandedKeys={expandAll ? null : [...expandedKeys]}
      onExpand={expandAll ? undefined : (keys) => setExpandedKeys(new Set(keys))}
      selectable={false}
      treeData={treeData}
    />
  )

  return <div className={css.tocWrapper}>{tree}</div>
}

Toc.defaultProps = { expandAll: false }
Toc.propTypes = { expandAll: PropTypes.bool }

export default Toc
