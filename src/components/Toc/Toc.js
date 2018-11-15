import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Tree from 'antd/lib/tree'

import css from './style.sass'
import appSelectors from '../../store/selectors/app'
import sectionSelectors from '../../store/selectors/section'
import { tocTreeType } from '../../lib/propTypes'
import { astToString } from '../../lib/util'
import ContentFragment from '../content/ContentFragment'
import SectionLink from '../SectionLink'

class Toc extends React.Component {
  static propTypes = {
    currentSectionId: PropTypes.string,
    currentLanguage: PropTypes.string.isRequired,
    title: PropTypes.shape({}),
    toc: tocTreeType.isRequired,
    expandAll: PropTypes.bool,
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    currentSectionId: null,
    expandAll: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      expandedKeys: props.currentSectionId ? [props.currentSectionId] : [],
    }
    this.onExpand = this.onExpand.bind(this)
  }

  componentDidUpdate({ currentSectionId: prevSectionId }, { expandedKeys }) {
    const { currentSectionId, expandAll } = this.props
    if (!expandAll && currentSectionId && currentSectionId !== prevSectionId) {
      this.expandCurrentSection(expandedKeys)
    }
  }

  onExpand(keys) {
    this.setState(prevState => ({
      ...prevState,
      expandedKeys: keys,
    }))
  }

  // auto-expand tree nodes when section changes
  expandCurrentSection(expandedKeys) {
    const { currentSectionId } = this.props

    // current key and all parent keys
    const allKeys = currentSectionId
      .split('/')
      .reduce((acc, id, idx) => [
        ...acc,
        idx > 0 ? `${acc[idx - 1]}/${id}` : id,
      ], [])

    // add all keys
    let newExpandedKeys = [...expandedKeys]
    allKeys.forEach((key) => {
      if (!expandedKeys.includes(key)) {
        newExpandedKeys = [...newExpandedKeys, key]
      }
    })
    this.setState(prevState => ({
      ...prevState,
      expandedKeys: newExpandedKeys,
    }))
  }

  renderTreeNodes(section) {
    const { currentSectionId, currentLanguage } = this.props
    const {
      title,
      id: sectionId,
      children = [],
    } = section

    const className = classNames({
      active: sectionId === currentSectionId,
    })

    const sectionNode = (
      <SectionLink sectionId={sectionId}>
        <a>
          {astToString(title[currentLanguage])}
        </a>
      </SectionLink>
    )

    return (
      <Tree.TreeNode
        title={sectionNode}
        key={sectionId}
        className={className}
      >
        {children.map(s => this.renderTreeNodes(s))}
      </Tree.TreeNode>
    )
  }

  render() {
    const {
      currentLanguage,
      toc,
      title,
      expandAll,
    } = this.props

    const { expandedKeys } = this.state

    const expandProps = expandAll
      ? { defaultExpandAll: true }
      : { expandedKeys }

    const header = title && title[currentLanguage]
      ? <ContentFragment content={title[currentLanguage]} />
      : null

    return (
      <div className={css.tocWrapper}>
        <h2>
          {header}
        </h2>
        <Tree
          className={classNames({ [css.disableExpand]: expandAll })}
          onExpand={this.onExpand}
          {...expandProps}
        >
          {toc.map(s => this.renderTreeNodes(s))}
        </Tree>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentLanguage: appSelectors.getLanguage(state),
  currentSectionId: appSelectors.getCurrentSectionId(state),
  title: appSelectors.getTitle(state),
  toc: sectionSelectors.getToc(state),
})

export { Toc } // for testing
export default connect(mapStateToProps)(Toc)
