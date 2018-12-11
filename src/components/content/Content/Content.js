import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import appSelectors from '../../../store/selectors/app'
import courseSelectors from '../../../store/selectors/course'
import sectionSelectors from '../../../store/selectors/section'
import withLoadingPlaceholder from '../../hoc/withLoadingPlaceholder'
import withMathJax from '../../hoc/withMathJax'
import ContentFragment from '../ContentFragment'
import Breadcrumb from '../Breadcrumb'
import SectionNav from '../SectionNav'
import Placeholder from './Placeholder'
import { sectionType } from '../../../lib/propTypes'

class Content extends React.Component {
  static propTypes = {
    section: sectionType,
    currentLanguage: PropTypes.string.isRequired,
    mathJaxContentRef: PropTypes.objectOf(PropTypes.any).isRequired,
    typesetMathJax: PropTypes.func.isRequired,
  }

  static defaultProps = {
    section: { id: '', title: '' },
  }

  componentDidMount() {
    const { typesetMathJax } = this.props
    typesetMathJax()
  }

  componentDidUpdate(prevProps) {
    const { section, typesetMathJax } = this.props
    if (section !== prevProps.section) {
      typesetMathJax()
    }
  }

  render() {
    const {
      section,
      currentLanguage,
      mathJaxContentRef,
    } = this.props

    // TODO: Show flat list of sub-sections, no tree needed

    return (
      <React.Fragment>
        <SectionNav />
        <Breadcrumb />
        <h1>
          {section.title[currentLanguage]}
        </h1>
        <div ref={mathJaxContentRef}>
          <ContentFragment content={section.content[currentLanguage]} />
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  let ret = { loading: true }
  const course = courseSelectors.getCurrentCourse(state)
  if (course && course.currentSectionId) {
    const language = appSelectors.getLanguage(state)
    const section = sectionSelectors.getSection(state, course.currentSectionId)
    if (section && section.content[language]) {
      ret = {
        loading: false,
        section,
        currentLanguage: language,
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
