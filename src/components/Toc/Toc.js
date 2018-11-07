import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Tree from 'antd/lib/tree'
import Router from 'next/router'

import css from './style.sass'
import appSelectors from '../../store/selectors/app'
import sectionSelectors from '../../store/selectors/section'
import { tocTreeType } from '../../lib/propTypes'
import { getSectionHref } from '../../lib/util'
import ContentFragment from '../content/ContentFragment'

// TODO: auto-expand sub-tree for active sections

class Toc extends React.Component {
  static propTypes = {
    toc: tocTreeType.isRequired,
    currentSectionPath: PropTypes.string,
    currentLanguage: PropTypes.string.isRequired,
    header: PropTypes.string,
    defaultExpandAll: PropTypes.bool,
    disableExpand: PropTypes.bool,
    showActive: PropTypes.bool,
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    currentSectionPath: null,
    header: null,
    defaultExpandAll: false,
    disableExpand: false,
    showActive: true,
  }

  static onSelect(sectionPath) {
    const { href, as } = getSectionHref(sectionPath)
    Router.push(href, as)
  }

  render() {
    const {
      toc,
      currentSectionPath,
      currentLanguage,
      header,
      defaultExpandAll,
      disableExpand,
      showActive,
    } = this.props

    const renderTreeNodes = (section) => {
      const {
        title,
        id: sectionPath,
        children = [],
      } = section

      const className = classNames({
        active: showActive && sectionPath === currentSectionPath,
      })

      return (
        <Tree.TreeNode
          title={<ContentFragment content={title[currentLanguage]} />}
          key={sectionPath}
          className={className}
        >
          {children.map(s => renderTreeNodes(s, sectionPath))}
        </Tree.TreeNode>
      )
    }

    const expandProps = defaultExpandAll
      ? { defaultExpandAll: true }
      : { defaultExpandedKeys: [currentSectionPath] }

    return (
      <div className={css.tocWrapper}>
        <h2>
          {header || 'TODO: fill in course title'}
        </h2>
        <Tree
          onSelect={Toc.onSelect}
          className={classNames({ [css.disableExpand]: disableExpand })}
          {...expandProps}
        >
          {toc.map(s => renderTreeNodes(s))}
        </Tree>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  toc: sectionSelectors.getToc(state),
  currentLanguage: appSelectors.getLanguage(state),
  currentSectionPath: appSelectors.getCurrentSectionId(state),
})

export { Toc } // for testing
export default connect(mapStateToProps)(Toc)
