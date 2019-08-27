import React from 'react'

import { contentType } from '@innodoc/client-misc/src/propTypes'

import ContentFragment from '..'

// TODO: Remove this?

const QuestionGroup = ({ content }) => (
  <ContentFragment content={content} />
)

QuestionGroup.propTypes = {
  content: contentType.isRequired,
}

export default QuestionGroup
