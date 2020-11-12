import React from 'react'

import { contentType } from '@innodoc/client-misc/src/propTypes'

import ContentFragment from '../..'

// TODO: Remove as this is doing nothing

const QuestionGroup = ({ content }) => {
  return <ContentFragment content={content} />
}

QuestionGroup.propTypes = {
  content: contentType.isRequired,
}

export default QuestionGroup
