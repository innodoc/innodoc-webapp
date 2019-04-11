import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import css from '../header.sass'
import appSelectors from '../../../store/selectors'
import sectionSelectors from '../../../store/selectors/section'
import withLoadingPlaceholder from '../../hoc/withLoadingPlaceholder'
import withMathJax from '../../hoc/withMathJax'
import ContentFragment from '../ContentFragment'
import Breadcrumb from '../Breadcrumb'
import SectionNav from '../SectionNav'
import Placeholder from './Placeholder'
import SubsectionList from './SubsectionList'
import { sectionType } from '../../../lib/propTypes'

class Content extends React.Component {
  static propTypes = {
    section: sectionType,
    subsections: PropTypes.arrayOf(sectionType).isRequired,
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
      subsections,
      currentLanguage,
      mathJaxContentRef,
    } = this.props

    const subsectionList = subsections.length
      ? <SubsectionList subsections={subsections} currentLanguage={currentLanguage} />
      : null

    return (
      <React.Fragment>
        <SectionNav />
        <Breadcrumb />
        <h1 className={css.header}>
          {section.title[currentLanguage]}
        </h1>
        {subsectionList}
        <div ref={mathJaxContentRef}>
          <ContentFragment content={section.content[currentLanguage]} />
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  let ret = { loading: true }
  const { language } = appSelectors.getApp(state)
  if (language) {
    const section = sectionSelectors.getCurrentSection(state)
    if (section && section.content[language]) {
      const subsections = sectionSelectors.getCurrentSubsections(state)
      ret = {
        loading: false,
        section,
        subsections,
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
