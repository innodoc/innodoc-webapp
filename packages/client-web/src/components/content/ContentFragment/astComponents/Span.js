import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { contentType } from '@innodoc/client-misc/src/propTypes'
import { attributesToObject } from '@innodoc/client-misc/src/util'

import ContentFragment from '..'
import InputHint from '../cards/InputHint'
import Question from '../exercises/questions'

const IndexSpan = ({ id, indexTerm, content }) => (
  <span className="index-term" data-index-term={indexTerm} id={id}>
    <ContentFragment content={content} />
  </span>
)
IndexSpan.propTypes = {
  content: contentType.isRequired,
  id: PropTypes.string.isRequired,
  indexTerm: PropTypes.string.isRequired,
}

const Span = ({ data }) => {
  const [[id, spanClassNames, attributes], content] = data
  const attrObj = attributesToObject(attributes)

  if (Object.keys(attrObj).includes('data-index-term')) {
    return <IndexSpan content={content} id={id} indexTerm={attrObj['data-index-term']} />
  }

  if (spanClassNames.length === 0 && attributes.length === 0) {
    if (content.length === 0) {
      // skip empty spans
      return null
    }
    // unwrap useless wrapper span
    return <ContentFragment content={content} />
  }

  if (spanClassNames.includes('hint-text')) {
    return <InputHint id={id} content={content} />
  }

  if (spanClassNames.includes('question')) {
    const questionClasses = spanClassNames.filter((className) => className !== 'question')
    return <Question id={id} questionClasses={questionClasses} attributes={attributes} />
  }

  // Support color style
  const style = {}
  if (attrObj.style) {
    const match = /color:\s+([^;]+)/.exec(attrObj.style)
    if (match) {
      const [, color] = match
      style.color = color
    }
  }

  return (
    <span className={classNames(spanClassNames)} id={id} style={style}>
      <ContentFragment content={content} />
    </span>
  )
}
Span.propTypes = { data: PropTypes.arrayOf(PropTypes.array).isRequired }

export { IndexSpan }
export default Span
