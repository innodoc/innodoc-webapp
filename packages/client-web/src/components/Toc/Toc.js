import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { Tree } from 'antd'

import courseSelectors from '@innodoc/client-store/src/selectors/course'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'
import { SectionLink } from '../content/links'

import css from './style.sss'

const ActiveSectionLabel = ({ sectionId }) => {
  const getSectionLink = useMemo(sectionSelectors.makeGetSectionLink, [])
  const { title } = useSelector((state) => getSectionLink(state, sectionId))
  return title
}

const renderTreeNodes = (section, currentSection) => {
  const { id: sectionId, children = [] } = section
  const active = sectionId === currentSection
  const sectionNode = active ? (
    <ActiveSectionLabel sectionId={sectionId} />
  ) : (
    <SectionLink contentId={sectionId} />
  )
  return (
    <Tree.TreeNode
      className={classNames({ active })}
      key={sectionId}
      title={sectionNode}
    >
      {children.map((s) => renderTreeNodes(s, currentSection))}
    </Tree.TreeNode>
  )
}

const useAutoExpand = (
  currentSection,
  course,
  expandAll,
  expandedKeys,
  setExpandedKeys
) =>
  useEffect(() => {
    if (!expandAll && course && currentSection) {
      // current key and all parent keys
      const allKeys = currentSection
        .split('/')
        .reduce(
          (acc, id, idx) => [...acc, idx > 0 ? `${acc[idx - 1]}/${id}` : id],
          []
        )
      // add all keys
      let newExpandedKeys = [...expandedKeys]
      allKeys.forEach((key) => {
        if (!expandedKeys.includes(key)) {
          newExpandedKeys = [...newExpandedKeys, key]
        }
      })
      setExpandedKeys(newExpandedKeys)
    }
  }, [course, currentSection, expandAll, expandedKeys, setExpandedKeys])

const Toc = ({ expandAll }) => {
  const course = useSelector(courseSelectors.getCurrentCourse)
  const toc = useSelector(sectionSelectors.getToc)
  const currentSection = course ? course.currentSection : undefined
  const [expandedKeys, setExpandedKeys] = useState(
    currentSection ? [currentSection] : []
  )

  useAutoExpand(
    currentSection,
    course,
    expandAll,
    expandedKeys,
    setExpandedKeys
  )

  const treeNodes = toc.map((s) => renderTreeNodes(s, currentSection))
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
