import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import { contentType } from '../../../lib/propTypes'
import ContentFragment from '../ContentFragment'
import InputHint from './messages/InputHint'
import debugCSS from './debug-style.sass'

const IndexSpan = ({ indexConcept, content }) => (
  <span className="index-concept" data-index-concept={indexConcept}>
    <ContentFragment content={content} />
  </span>
)
IndexSpan.propTypes = {
  indexConcept: PropTypes.string.isRequired,
  content: contentType.isRequired,
}

// TODO: use components/SectionLink
const SectionLink = ({ section }) => (
  // insert proper href and section Title as text
  <Link href={section}>
    <a>
      {section}
    </a>
  </Link>
)


SectionLink.propTypes = { section: PropTypes.string.isRequired }

const HintText = ({ content }) => (
  <span className="hint-text">
    <ContentFragment content={content} />
  </span>
)
HintText.propTypes = { content: contentType.isRequired }

const Span = ({ data }) => {
  const [[id, classNames, attributes], content] = data

  if (attributes.length === 1) {
    const attr = attributes[0][0]
    const val = attributes[0][1]
    if (attr === 'data-index-concept') { return <IndexSpan indexConcept={val} content={content} /> }
    if (attr === 'data-link-section') { return <SectionLink section={val} /> }
  }

  if (classNames.includes('hint-text')) {
    return <InputHint id={id} content={content} />
  }

  // skip empty spans
  if (classNames.length === 0 && attributes.length === 0 && content.length === 0) {
    return null
  }

  // unwrap useless wrapper span
  if (classNames.length === 0 && attributes.length === 0 && content.length > 0) {
    return <ContentFragment content={content} />
  }

  if (process.env.NODE_ENV !== 'production') {
    // if nothing matches return a debug element
    const msg = `Strange span: classes=${classNames} attrs=${attributes} content-length=${content.length}`
    return (
      <span>
        <span className={debugCSS.errorBGColor}>
          {msg}
        </span>
        <ContentFragment content={content} />
      </span>
    )
  }

  return null
}

Span.propTypes = { data: PropTypes.arrayOf(PropTypes.array).isRequired }

export default Span
