import React from 'react'
import PropTypes from 'prop-types'
import Tree from 'antd/lib/tree'
import Router from 'next/router'

import css from './style.sass'
import { tocTreeType } from '../../lib/propTypes'
import ContentFragment from '../content/ContentFragment'

class Toc extends React.Component {
  static propTypes = {
    toc: tocTreeType.isRequired,
    header: PropTypes.string,
    sectionPrefix: PropTypes.string,
    defaultExpandAll: PropTypes.bool,
    disableExpand: PropTypes.bool,
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    sectionPrefix: '',
    header: null,
    defaultExpandAll: false,
    disableExpand: false,
  }

  static onSelect(sectionPath) {
    Router.push(`/page/${sectionPath}`)
  }

  render() {
    const {
      toc,
      header,
      sectionPrefix,
      defaultExpandAll,
      disableExpand,
    } = this.props

    const renderTreeNodes = (section, parentPrefix) => {
      const {
        title,
        id,
        children = [],
      } = section
      const prefix = parentPrefix ? `${parentPrefix}/` : ''
      const sectionPath = `${prefix}${id}`
      return (
        <Tree.TreeNode
          title={<ContentFragment content={title} />}
          key={sectionPath}
        >
          {children.map(s => renderTreeNodes(s, sectionPath))}
        </Tree.TreeNode>
      )
    }

    return (
      <div className={css.tocWrapper}>
        <h2>
          {header}
        </h2>
        <Tree
          defaultExpandAll={defaultExpandAll}
          onSelect={Toc.onSelect}
          className={disableExpand ? css.disableExpand : null}
        >
          {toc.map(s => renderTreeNodes(s, sectionPrefix))}
        </Tree>
      </div>
    )
  }
}

export default Toc
