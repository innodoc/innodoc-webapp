import { Tree } from 'antd'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import { getCurrentCourse } from '@innodoc/store/selectors/course'
import { getToc } from '@innodoc/store/selectors/section'

import getTreeData from './getTreeData.jsx'
import css from './Toc.module.sss'
import useAutoExpand from './useAutoExpand.js'

function Toc({ expandAll }) {
  const { t } = useTranslation()
  const course = useSelector(getCurrentCourse)
  const tocData = useSelector(getToc)
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
