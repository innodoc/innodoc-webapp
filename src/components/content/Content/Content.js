import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Dimmer, Header, Loader } from 'semantic-ui-react'

import { selectors as contentSelectors } from '../../../store/reducers/content'
import { selectors as i18nSelectors } from '../../../store/reducers/i18n'
import { tocTreeType } from '../../../lib/propTypes'
import withMathJax from '../../hoc/withMathJax'
import ContentFragment from '../ContentFragment'
import BreadcrumbWrapper from '../BreadcrumbWrapper'
import Placeholder from './Placeholder'
import Toc from '../../Toc'
import css from './style.sass'

class Content extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    content: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.arrayOf(PropTypes.object),
    sectionLevel: PropTypes.number,
    subToc: tocTreeType,
    mathJaxContentRef: PropTypes.objectOf(PropTypes.any).isRequired,
    typesetMathJax: PropTypes.func.isRequired,
  }

  static defaultProps = {
    title: [],
    content: [],
    subToc: [],
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
      content: sectionContent,
      title,
      loading,
      sectionLevel,
      subToc,
      mathJaxContentRef,
    } = this.props

    const toc = subToc && sectionLevel < 3
      ? <Toc toc={subToc} />
      : null

    const content = loading
      ? <Placeholder />
      : (
        <React.Fragment>
          <BreadcrumbWrapper />
          <Header as="h1">
            <ContentFragment content={title} />
          </Header>
          {toc}
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
  const loading = contentSelectors.getContentLoading(state)
  const id = contentSelectors.getCurrentSectionId(state)
  const language = i18nSelectors.getLanguage(state)
  if (id) {
    const { title } = contentSelectors.getSectionMeta(state, language, id)
    const content = contentSelectors.getSectionContent(state, language, id)
    const sectionLevel = contentSelectors.getSectionLevel(state, id)
    return {
      loading,
      content,
      title,
      sectionLevel,
    }
  }
  return { loading }
}

export default connect(mapStateToProps)(withMathJax(Content))
