import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import BaseContentComponent from './Base'
import ContentFragment from '../ContentFragment'
import debugCSS from './debug-style.sass'

const IndexSpan = ({indexConcept, content}) => (
  <span className="index-concept" data-index-concept={indexConcept}>
    <ContentFragment content={content} />
  </span>
)
IndexSpan.propTypes = {
  indexConcept: PropTypes.string.isRequired,
  content: PropTypes.array.isRequired
}

const SectionLink = ({section}) => (
  // insert proper href and section Title as text
  <Link href={section}><a>{section}</a></Link>
)
SectionLink.propTypes = {
  section: PropTypes.string.isRequired
}

const HintText = ({content}) => (
  <span className="hint-text">
    <ContentFragment content={content} />
  </span>
)
HintText.propTypes = {
  content: PropTypes.array.isRequired
}

export default class Span extends BaseContentComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  render() {
    const [, classNames, attributes] = this.props.data[0]
    const content = this.props.data[1]

    if (attributes.length === 1) {
      const attr = attributes[0][0]
      const val = attributes[0][1]
      if (attr === 'data-index-concept')
        return <IndexSpan indexConcept={val} content={content} />
      if (attr === 'data-link-section')
        return <SectionLink section={val} />
    }

    if (classNames.includes('hint-text')) {
      return <HintText classNames="hint-text" content={content} />
    }

    // skip empty spans
    if (classNames.length === 0 &&
        attributes.length === 0 &&
        content.length === 0)
      return null

    // unwrap useless wrapper span
    if (classNames.length === 0 &&
        attributes.length === 0 &&
        content.length > 0)
      return <ContentFragment content={content} />

    if (process.env.NODE_ENV === 'production')
      return null

    // if nothing matches return a debug element
    return (
      <span>
        <span className={debugCSS.errorBGColor}>
          Strange span: classes={classNames} attrs={attributes} content-length={content.length}
        </span>
        <ContentFragment content={content} />
      </span>
    )
  }
}
