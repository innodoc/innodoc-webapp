import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'

import fadeInCss from '../../style/fadeIn.sass'
import css from './style.sass'
import appSelectors from '../../store/selectors'
import sectionSelectors from '../../store/selectors/section'
import withMathJax, { typesettingStates, typesettingStatusType } from '../hoc/withMathJax'
import ContentFragment from './ContentFragment'
import Breadcrumb from './Breadcrumb'
import SectionNav from './SectionNav'
import SubsectionList from './SubsectionList'
import { sectionType, refType } from '../../lib/propTypes'

class Content extends React.Component {
  static propTypes = {
    currentLanguage: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    mathJaxContentRef: refType.isRequired,
    section: sectionType,
    subsections: PropTypes.arrayOf(sectionType),
    typesetMathJax: PropTypes.func.isRequired,
    typesettingStatus: typesettingStatusType.isRequired,
  }

  static defaultProps = {
    currentLanguage: null,
    section: {
      id: '',
      ord: [0],
      title: {},
      content: {},
    },
    subsections: [],
  }

  componentDidUpdate(prevProps) {
    const { currentLanguage, section, typesetMathJax } = this.props
    if (
      section !== prevProps.section
      && currentLanguage
      && Object.prototype.hasOwnProperty.call(section.content, currentLanguage)
      && section.content[currentLanguage].length
    ) {
      typesetMathJax()
    }
  }

  render() {
    const {
      currentLanguage,
      loading,
      mathJaxContentRef,
      section,
      subsections,
      typesettingStatus,
    } = this.props

    const show = !loading && typesettingStatus !== typesettingStates.PENDING
    const className = classNames({
      [fadeInCss.show]: show,
      [fadeInCss.hide]: !show,
    })

    const subsectionList = subsections.length
      ? <SubsectionList subsections={subsections} />
      : null

    const rootContentFragment = section && currentLanguage
      ? <ContentFragment content={section.content[currentLanguage]} />
      : null

    const content = (
      <div className={className}>
        <h1 className={css.header}>
          {currentLanguage ? section.title[currentLanguage] : ''}
        </h1>
        {subsectionList}
        <div ref={mathJaxContentRef}>{rootContentFragment}</div>
      </div>
    )

    return (
      <React.Fragment>
        <SectionNav />
        <Breadcrumb />
        {content}
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

export { Content as BareContent, mapStateToProps } // for testing
export default connect(mapStateToProps)(
  withMathJax(
    Content
  )
)
