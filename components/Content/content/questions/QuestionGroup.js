import React from 'react'
import { Container } from 'semantic-ui-react'

import ContentFragment from '../../ContentFragment'
import { contentType } from '../../../../lib/propTypes'

const QuestionGroup = ({ content }) => (
  <Container>
    <ContentFragment content={content} />
  </Container>
)

QuestionGroup.propTypes = {
  content: contentType.isRequired,
}

export default QuestionGroup
