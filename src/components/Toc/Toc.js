import React from 'react'
import PropTypes from 'prop-types'
import Tree from 'antd/lib/tree'

import { tocTreeType } from '../../lib/propTypes'
// import TocItem from './Item'
import ContentFragment from '../content/ContentFragment'

const Toc = ({
  toc,
  header,
  sectionPrefix,
  defaultExpandAll,
}) => {
  const sectionNode = (section) => {
    const {
      title,
      id,
      children = [],
    } = section
    const prefix = this ? `${this}/` : ''
    const sectionPath = `${prefix}${id}`
    return (
      <Tree.TreeNode title={<ContentFragment content={title} />} key={sectionPath}>
        {children.map(sectionNode, sectionPath)}
      </Tree.TreeNode>
    )
  }

  return (
    <React.Fragment>
      <h2>
        {header}
      </h2>
      <Tree defaultExpandAll={defaultExpandAll} autoExpandParent={false}>
        {toc.map(sectionNode, sectionPrefix)}
      </Tree>
    </React.Fragment>
  )
}

Toc.propTypes = {
  toc: tocTreeType.isRequired,
  header: PropTypes.string,
  sectionPrefix: PropTypes.string,
  defaultExpandAll: PropTypes.bool,
}

Toc.defaultProps = {
  ...React.Component.defaultProps,
  sectionPrefix: '',
  header: null,
  defaultExpandAll: false,
}

export default Toc
