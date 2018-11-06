import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import contentSelectors from '../../../store/selectors/content'
import withLoadingPlaceholder from '../../hoc/withLoadingPlaceholder'
import withMathJax from '../../hoc/withMathJax'
import ContentFragment from '../ContentFragment'
import Breadcrumb from '../Breadcrumb'
import SectionNav from '../SectionNav'
import Placeholder from './Placeholder'
import { sectionType } from '../../../lib/propTypes'
import css from './style.sass'

class Content extends React.Component {
  static propTypes = {
    content: PropTypes.arrayOf(PropTypes.object),
    section: sectionType,
    mathJaxContentRef: PropTypes.objectOf(PropTypes.any).isRequired,
    typesetMathJax: PropTypes.func.isRequired,
  }

  static defaultProps = {
    content: [],
    section: { id: '', title: [] },
  }

  componentDidMount() {
    const { typesetMathJax } = this.props
    typesetMathJax()
  }

  componentDidUpdate(prevProps) {
    const { content, typesetMathJax } = this.props
    if (content !== prevProps.content) {
      typesetMathJax()
    }
  }

  render() {
    const {
      section,
      content: sectionContent,
      mathJaxContentRef,
    } = this.props

    // TODO: Show flat list of sub-sections, no tree needed

    return (
      <React.Fragment>
        <SectionNav />
        <Breadcrumb />
        <h1>
          <ContentFragment content={section.title} />
        </h1>
        <div className={css.content} ref={mathJaxContentRef}>
          <ContentFragment content={sectionContent} />
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  let ret = { loading: true }
  const path = contentSelectors.getCurrentSectionPath(state)
  if (path) {
    const section = contentSelectors.getSection(state, path)
    if (section) {
      ret = {
        loading: false,
        section,
        content: contentSelectors.getSectionContent(state, path),
      }
    }
  }
  return ret
}

export { Content, mapStateToProps } // for testing
export default connect(mapStateToProps)(
  withMathJax(
    withLoadingPlaceholder(Placeholder)(
      Content
    )
  )
)
