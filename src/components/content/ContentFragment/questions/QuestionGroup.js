import React from 'react'

import ContentFragment from '..'
import { contentType } from '../../../../lib/propTypes'

// TODO: Remove this?

const QuestionGroup = ({ content }) => (
  <ContentFragment content={content} />
)

QuestionGroup.propTypes = {
  content: contentType.isRequired,
}

export default QuestionGroup
