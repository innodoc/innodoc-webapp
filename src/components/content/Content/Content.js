import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Dimmer, Header, Loader } from 'semantic-ui-react'
import { translate } from 'react-i18next'

import contentSelectors from '../../../store/selectors/content'
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
    loading: PropTypes.bool.isRequired,
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

  componentDidUpdate(prevProps) {
    const { content, typesetMathJax } = this.props
    if (prevProps.content !== content) {
      typesetMathJax()
    }
  }

  render() {
    const {
      section,
      content: sectionContent,
      loading,
      sectionLevel,
      mathJaxContentRef,
      t,
    } = this.props

    const content = loading
      ? <Placeholder />
      : (
        <React.Fragment>
          <SectionNav />
          <Breadcrumb />
          <Header as="h1">
            <ContentFragment content={section.title} />
          </Header>
          {
            section.children && section.children.length && sectionLevel < 3
              ? (
                <Toc
                  vertical
                  borderless
                  size="large"
                  toc={section.children}
                  header={t('content.subsections')}
                  sectionPrefix={`${section.id}/`}
                />
              )
              : null
          }
          <div className={css.content} ref={mathJaxContentRef}>
            <ContentFragment content={sectionContent} />
          </div>
        </React.Fragment>
      )

    return (
      <Dimmer.Dimmable dimmed={loading}>
        <Dimmer active={loading} inverted>
          <Loader active={loading} size="big" />
        </Dimmer>
        {content}
      </Dimmer.Dimmable>
    )
  }
}

const mapStateToProps = (state) => {
  const path = contentSelectors.getCurrentSectionPath(state)
  if (path) {
    const section = contentSelectors.getSection(state, path)
    if (section) {
      return {
        loading: false,
        section,
        content: contentSelectors.getSectionContent(state, path),
        sectionLevel: contentSelectors.getSectionLevel(state, path),
      }
    }
  }
  return { loading: true }
}

export default connect(mapStateToProps)(withMathJax(translate()(Content)))
