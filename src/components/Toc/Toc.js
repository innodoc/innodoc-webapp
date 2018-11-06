import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Tree from 'antd/lib/tree'
import Router from 'next/router'

import css from './style.sass'
import i18nSelectors from '../../store/selectors/i18n'
import contentSelectors from '../../store/orm/selectors/section'
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
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    currentSectionPath: null,
    header: null,
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
      currentLanguage,
      header,
      defaultExpandAll,
      disableExpand,
    } = this.props

    const renderTreeNodes = (section) => {
      const {
        title,
        id: sectionPath,
        children = [],
      } = section
      return (
        <Tree.TreeNode
          title={<ContentFragment content={title[currentLanguage]} />}
          key={sectionPath}
          className={classNames({ active: sectionPath === currentSectionPath })}
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
          {header}
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
  toc: contentSelectors.getToc(state),
  currentLanguage: i18nSelectors.getLanguage(state),
})

export { Toc } // for testing
export default connect(mapStateToProps)(Toc)
