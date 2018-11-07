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
import SectionLink from '../SectionLink'

class Toc extends React.Component {
  static propTypes = {
    toc: tocTreeType.isRequired,
    currentSectionPath: PropTypes.string,
    currentLanguage: PropTypes.string.isRequired,
    header: PropTypes.string,
    expandAll: PropTypes.bool,
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    currentSectionPath: null,
    header: null,
    expandAll: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      expandedKeys: props.currentSectionPath ? [props.currentSectionPath] : [],
    }
    this.onExpand = this.onExpand.bind(this)
  }

  componentDidUpdate({ currentSectionPath: prevSectionPath }, { expandedKeys }) {
    const { currentSectionPath, expandAll } = this.props
    if (!expandAll && currentSectionPath && currentSectionPath !== prevSectionPath) {
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
    const { currentSectionPath } = this.props

    // current key and all parent keys
    const allKeys = currentSectionPath
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
    const { currentSectionPath, currentLanguage } = this.props
    const {
      title,
      id: sectionPath,
      children = [],
    } = section

    const className = classNames({
      active: sectionPath === currentSectionPath,
    })

    const sectionNode = (
      <SectionLink sectionPath={sectionPath}>
        <a>
          {astToString(title[currentLanguage])}
        </a>
      </SectionLink>
    )

    return (
      <Tree.TreeNode
        title={sectionNode}
        key={sectionPath}
        className={className}
      >
        {children.map(s => this.renderTreeNodes(s))}
      </Tree.TreeNode>
    )
  }

  render() {
    const {
      toc,
      header,
      expandAll,
    } = this.props

    const { expandedKeys } = this.state

    const expandProps = expandAll
      ? { defaultExpandAll: true }
      : { expandedKeys }

    return (
      <div className={css.tocWrapper}>
        <h2>
          {header || 'TODO: fill in course title'}
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
  toc: sectionSelectors.getToc(state),
  currentLanguage: appSelectors.getLanguage(state),
  currentSectionPath: appSelectors.getCurrentSectionId(state),
})

export { Toc } // for testing
export default connect(mapStateToProps)(Toc)
