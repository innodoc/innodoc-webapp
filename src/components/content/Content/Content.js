import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Header } from 'semantic-ui-react'
import { translate } from 'react-i18next'

import contentSelectors from '../../../store/selectors/content'
import withLoadingPlaceholder from '../../hoc/withLoadingPlaceholder'
import withMathJax from '../../hoc/withMathJax'
import ContentFragment from '../ContentFragment'
import Breadcrumb from '../Breadcrumb'
import SectionNav from '../SectionNav'
import Placeholder from './Placeholder'
import Toc from '../../Toc'
import { sectionType } from '../../../lib/propTypes'
import css from './style.sass'

class Content extends React.Component {
  static propTypes = {
    content: PropTypes.arrayOf(PropTypes.object),
    section: sectionType,
    sectionLevel: PropTypes.number,
    mathJaxContentRef: PropTypes.objectOf(PropTypes.any).isRequired,
    typesetMathJax: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  }

  static defaultProps = {
    content: [],
    section: { id: '', title: [] },
    sectionLevel: null,
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
      sectionLevel,
      mathJaxContentRef,
      t,
    } = this.props

    const subToc = section.children && section.children.length && sectionLevel < 3
      ? (
        <Toc
          vertical
          borderless
          size="large"
          toc={section.children}
          header={t('content.subsections')}
          sectionPrefix={`${section.id}/`}
        />
      ) : null

    return (
      <React.Fragment>
        <SectionNav />
        <Breadcrumb />
        <Header as="h1">
          <ContentFragment content={section.title} />
        </Header>
        {subToc}
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
        sectionLevel: contentSelectors.getSectionLevel(state, path),
      }
    }
  }
  return ret
}

export { Content, mapStateToProps } // for testing
export default connect(mapStateToProps)(
  withMathJax(
    translate()(
      withLoadingPlaceholder(Placeholder)(
        Content
      )
    )
  )
)
