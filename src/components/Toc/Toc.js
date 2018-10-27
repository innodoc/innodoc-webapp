import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Tree from 'antd/lib/tree'
import Router from 'next/router'

import css from './style.sass'
import { tocTreeType } from '../../lib/propTypes'
import { getSectionHref } from '../../lib/util'
import ContentFragment from '../content/ContentFragment'

// TODO: auto-expand sub-tree for active sections

class Toc extends React.Component {
  static propTypes = {
    toc: tocTreeType.isRequired,
    currentSectionPath: PropTypes.string,
    header: PropTypes.string,
    sectionPrefix: PropTypes.string,
    defaultExpandAll: PropTypes.bool,
    disableExpand: PropTypes.bool,
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    currentSectionPath: null,
    header: null,
    sectionPrefix: '',
    defaultExpandAll: false,
    disableExpand: false,
  }

  static onSelect(sectionPath) {
    const { href, as } = getSectionHref(sectionPath)
    Router.push(href, as)
  }

  render() {
    const {
      toc,
      currentSectionPath,
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
          className={classNames({ active: sectionPath === currentSectionPath })}
        >
          {children.map(s => renderTreeNodes(s, sectionPath))}
        </Tree.TreeNode>
      )
    }

    const expandProps = {}
    if (defaultExpandAll) {
      expandProps.defaultExpandAll = true
    } else {
      expandProps.defaultExpandedKeys = [currentSectionPath]
    }

    return (
      <div className={css.tocWrapper}>
        <h2>
          {header}
        </h2>
        <Tree
          onSelect={Toc.onSelect}
          className={classNames({ [css.disableExpand]: disableExpand })}
          {...expandProps}
        >
          {toc.map(s => renderTreeNodes(s, sectionPrefix))}
        </Tree>
      </div>
    )
  }
}

export default Toc
