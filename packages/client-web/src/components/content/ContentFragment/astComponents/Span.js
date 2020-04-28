import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from 'antd'

import { contentType } from '@innodoc/client-misc/src/propTypes'
import { attributesToObject } from '@innodoc/client-misc/src/util'

import ContentFragment from '..'
import InputHint from '../cards/InputHint'
import Question from '../questions'

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
  const [[id, classNames, attributes], content] = data
  const attrObj = attributesToObject(attributes)

  if (Object.keys(attrObj).includes('data-index-term')) {
    return (
      <IndexSpan
        content={content}
        id={id}
        indexTerm={attrObj['data-index-term']}
      />
    )
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
    const questionClasses = classNames.filter(
      (className) => className !== 'question'
    )
    return (
      <Question
        id={id}
        questionClasses={questionClasses}
        attributes={attributes}
      />
    )
  }

  if (process.env.NODE_ENV !== 'production') {
    const msg = `Unknown span: classes=${classNames} attrs=${attributes} content-length=${content.length}`
    return (
      <span>
        <Typography.Text type="danger">{msg}</Typography.Text>
        <ContentFragment content={content} />
      </span>
    )
  }

  return null
}
Span.propTypes = { data: PropTypes.arrayOf(PropTypes.array).isRequired }

export { IndexSpan }
export default Span
