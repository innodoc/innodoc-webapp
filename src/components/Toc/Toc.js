import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Tree from 'antd/lib/tree'

import css from './style.sass'
import appSelectors from '../../store/selectors'
import courseSelectors from '../../store/selectors/course'
import sectionSelectors from '../../store/selectors/section'
import { courseType, tocTreeType } from '../../lib/propTypes'
import SectionLink from '../SectionLink'

class Toc extends React.Component {
  static propTypes = {
    course: courseType,
    currentLanguage: PropTypes.string.isRequired,
    toc: tocTreeType.isRequired,
    expandAll: PropTypes.bool,
    title: PropTypes.string,
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    course: null,
    expandAll: false,
    title: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      expandedKeys: props.course && props.course.currentSectionId
        ? [props.course.currentSectionId]
        : [],
    }
    this.onExpand = this.onExpand.bind(this)
  }

  componentDidUpdate({ course: prevCourse }, { expandedKeys }) {
    const { course, expandAll } = this.props
    if (!expandAll
      && course.currentSectionId
      && course.currentSectionId !== prevCourse.currentSectionId) {
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
    const { course } = this.props

    // current key and all parent keys
    const allKeys = (course ? course.currentSectionId : null)
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
    const { course, currentLanguage } = this.props
    const {
      title,
      id: sectionId,
      children = [],
    } = section

    const className = classNames({
      active: sectionId === (course ? course.currentSectionId : null),
    })

    const sectionNode = (
      <SectionLink sectionId={sectionId}>
        <a>
          {title[currentLanguage]}
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
      ? title[currentLanguage]
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
  currentLanguage: appSelectors.getApp(state).language,
  course: courseSelectors.getCurrentCourse(state),
  toc: sectionSelectors.getToc(state),
})

export { Toc } // for testing
export default connect(mapStateToProps)(Toc)
