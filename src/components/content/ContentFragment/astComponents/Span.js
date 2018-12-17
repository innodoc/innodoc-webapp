import React from 'react'
import PropTypes from 'prop-types'

import { contentType } from '../../../../lib/propTypes'
import ContentFragment from '..'
import InputHint from '../cards/InputHint'
import SectionLink from '../../../SectionLink'
import css from './style.sass'

const IndexSpan = ({ indexConcept, content }) => (
  <span className="index-concept" data-index-concept={indexConcept}>
    <ContentFragment content={content} />
  </span>
)
IndexSpan.propTypes = {
  indexConcept: PropTypes.string.isRequired,
  content: contentType.isRequired,
}

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
    if (attr === 'data-link-section') {
      return (
        <SectionLink sectionId={val}>
          <a>
            <ContentFragment content={content} />
          </a>
        </SectionLink>
      )
    }
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
        <span className={css.errorBGColor}>
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
