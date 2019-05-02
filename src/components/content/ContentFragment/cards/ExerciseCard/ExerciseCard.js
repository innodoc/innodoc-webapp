import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import { contentType } from '../../../../../lib/propTypes'
import Card from '../Card'
import ExerciseProvider from './ExerciseProvider'

const ExerciseCard = ({ t, content, id }) => (
  <ExerciseProvider>
    <Card
      title={t('content.exercise')}
      cardType="exercise"
      icon="form"
      content={content}
      id={id}
    />
  </ExerciseProvider>
)

ExerciseCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
  id: PropTypes.string,
}

ExerciseCard.defaultProps = {
  id: null,
}

export { ExerciseCard } // for testing
export default withNamespaces()(ExerciseCard)
