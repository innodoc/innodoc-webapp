import React from 'react'
import PropTypes from 'prop-types'

import { contentType } from '../../../../lib/propTypes'
import ContentFragment from '..'
import InputHint from '../cards/InputHint'
import Question from '../questions'
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

const Span = ({ data }) => {
  const [[id, classNames, attributes], content] = data

  if (attributes.length === 1) {
    const attr = attributes[0][0]
    const val = attributes[0][1]
    if (attr === 'data-index-concept') {
      return <IndexSpan indexConcept={val} content={content} />
    }
  }

  if (classNames.length === 0 && attributes.length === 0) {
    if (content.length === 0) {
      // skip empty spans
      return null
    }
    // unwrap useless wrapper span
    return <ContentFragment content={content} />
  }

  if (classNames.includes('hint-text')) {
    return <InputHint id={id} content={content} />
  }

  if (classNames.includes('question')) {
    const questionClasses = classNames.filter((className) => className !== 'question')
    return <Question id={id} questionClasses={questionClasses} attributes={attributes} />
  }

  if (process.env.NODE_ENV !== 'production') {
    const msg = `Unknown span: classes=${classNames} attrs=${attributes} content-length=${content.length}`
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
export { IndexSpan }
